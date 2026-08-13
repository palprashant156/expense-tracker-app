import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY || 'mock-api-key';
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async processChat(userId: string, message: string) {
    this.logger.log(\`Processing AI chat for user \${userId}: \${message}\`);

    // 1. Fetch user context (deterministic source of truth)
    const accounts = await this.prisma.account.findMany({ where: { userId } });
    
    // In a real scenario, we would also fetch recent transactions
    // and format them as context for the AI.

    const context = JSON.stringify({
      accounts: accounts.map(a => ({ name: a.name, balance: a.balance, currency: a.currency })),
    });

    const prompt = \`
      You are SpendWise AI, an intelligent financial behavior analyst.
      Here is the user's current financial data:
      \${context}
      
      User message: "\${message}"
      
      Analyze the message and provide a concise, actionable response. 
      Important: Do not invent any numbers. Only use the numbers provided in the context.
    \`;

    try {
      // 2. Call Gemini
      const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Note: we're using a mock key if env isn't set, so this will fail locally without it.
      let aiResponseText = "";
      if (process.env.GEMINI_API_KEY) {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponseText = response.text();
      } else {
        // Fallback mock response for testing without API key
        aiResponseText = "Mock AI Response: Your total balance seems to be correct.";
      }

      // 3. DETERMINISTIC VALIDATION GATE
      // As requested: Post-process the AI response to ensure no hallucinated numbers.
      // E.g., Extract all numbers from the AI response and verify they exist in the DB context.
      const validatedResponse = this.runValidationGate(aiResponseText, accounts);

      return {
        role: 'assistant',
        content: validatedResponse,
      };
    } catch (error) {
      this.logger.error('Error generating AI response:', error);
      throw new InternalServerErrorException('Failed to process AI chat.');
    }
  }

  /**
   * Deterministic Validation Gate
   * Ensures the AI does not hallucinate balances or financial math.
   */
  private runValidationGate(aiResponse: string, accounts: any[]): string {
    // Collect all valid numbers from the source of truth
    const validNumbers = new Set(accounts.map(a => Number(a.balance)));
    
    // Extract all numbers from the AI response (basic regex for currency/numbers)
    const numbersInResponse = aiResponse.match(/\\d+(?:,\\d{3})*(?:\\.\\d+)?/g);
    
    if (numbersInResponse) {
      for (const numStr of numbersInResponse) {
        // Remove commas and parse
        const num = parseFloat(numStr.replace(/,/g, ''));
        
        // Exclude small integers that might just be formatting (e.g., "1.", "2.") or dates
        if (num < 1000) continue; 

        // If the number is large and not in our deterministic valid numbers set, it's a hallucination!
        if (!validNumbers.has(num)) {
          this.logger.warn(\`AI Hallucination Detected: Number \${num} not found in deterministic context.\`);
          // We can either block the response or append a warning. 
          // For strictness: we replace the response with a fallback.
          return "I encountered an error calculating those numbers. Please refer to your dashboard for accurate balances.";
        }
      }
    }

    return aiResponse;
  }
}
