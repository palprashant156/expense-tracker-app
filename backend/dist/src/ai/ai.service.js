"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const generative_ai_1 = require("@google/generative-ai");
let AiService = AiService_1 = class AiService {
    prisma;
    logger = new common_1.Logger(AiService_1.name);
    genAI;
    constructor(prisma) {
        this.prisma = prisma;
        const apiKey = process.env.GEMINI_API_KEY || 'mock-api-key';
        this.genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    }
    async processChat(userId, message) {
        this.logger.log(`Processing AI chat for user ${userId}: ${message}`);
        const accounts = await this.prisma.account.findMany({ where: { userId } });
        const context = JSON.stringify({
            accounts: accounts.map(a => ({ name: a.name, balance: a.balance, currency: a.currency })),
        });
        const prompt = `
      You are SpendWise AI, an intelligent financial behavior analyst.
      Here is the user's current financial data:
      ${context}
      
      User message: "${message}"
      
      Analyze the message and provide a concise, actionable response. 
      Important: Do not invent any numbers. Only use the numbers provided in the context.
    `;
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            let aiResponseText = "";
            if (process.env.GEMINI_API_KEY) {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                aiResponseText = response.text();
            }
            else {
                aiResponseText = "Mock AI Response: Your total balance seems to be correct.";
            }
            const validatedResponse = this.runValidationGate(aiResponseText, accounts);
            return {
                role: 'assistant',
                content: validatedResponse,
            };
        }
        catch (error) {
            this.logger.error('Error generating AI response:', error);
            throw new common_1.InternalServerErrorException('Failed to process AI chat.');
        }
    }
    runValidationGate(aiResponse, accounts) {
        const validNumbers = new Set(accounts.map(a => Number(a.balance)));
        const numbersInResponse = aiResponse.match(/\\d+(?:,\\d{3})*(?:\\.\\d+)?/g);
        if (numbersInResponse) {
            for (const numStr of numbersInResponse) {
                const num = parseFloat(numStr.replace(/,/g, ''));
                if (num < 1000)
                    continue;
                if (!validNumbers.has(num)) {
                    this.logger.warn(`AI Hallucination Detected: Number ${num} not found in deterministic context.`);
                    return "I encountered an error calculating those numbers. Please refer to your dashboard for accurate balances.";
                }
            }
        }
        return aiResponse;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AiService);
//# sourceMappingURL=ai.service.js.map