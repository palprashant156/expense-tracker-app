import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ChevronDown, Send, Sparkles } from 'lucide-react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  "How much did I spend on dining this month?",
  "Analyze my spending habits.",
  "Am I on track for my savings goal?",
];

export default function AiChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: "Hi Alex! I'm SpendWise AI. Ask me anything about your finances or spending habits." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Mock API call to backend
    setTimeout(() => {
      const assistantMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: "I've analyzed your data. Your total balance is ₹1,24,500. You spent ₹32,400 this month, which is 15% lower than last month!" 
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1500);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
          <View className="flex-row items-center">
            <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
              <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
            </View>
            <View>
              <Text className="text-base font-bold text-zinc-900 dark:text-white">SpendWise AI</Text>
              <Text className="text-xs text-zinc-500 dark:text-zinc-400">Financial Intelligence Engine</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <ChevronDown size={24} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
        </View>

        {/* Chat Area */}
        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View 
              key={msg.id} 
              className={\`mb-4 max-w-[85%] \${msg.role === 'user' ? 'self-end' : 'self-start'}\`}
            >
              <View 
                className={\`p-4 rounded-2xl \${
                  msg.role === 'user' 
                    ? 'bg-zinc-900 dark:bg-white rounded-tr-sm' 
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm'
                }\`}
              >
                <Text 
                  className={\`text-base \${
                    msg.role === 'user' 
                      ? 'text-white dark:text-zinc-900' 
                      : 'text-zinc-900 dark:text-white'
                  }\`}
                >
                  {msg.content}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View className="self-start max-w-[85%] mb-4 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-tl-sm">
              <ActivityIndicator size="small" color="#a1a1aa" />
            </View>
          )}
        </ScrollView>

        {/* Suggested Prompts */}
        {messages.length === 1 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="max-h-12 px-4 mb-2"
            contentContainerStyle={{ gap: 8 }}
          >
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <TouchableOpacity 
                key={index}
                onPress={() => sendMessage(prompt)}
                className="bg-zinc-100 dark:bg-zinc-900 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 h-9 justify-center"
              >
                <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Input Area */}
        <View className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 flex-row items-center bg-white dark:bg-zinc-950">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about your finances..."
            placeholderTextColor="#a1a1aa"
            className="flex-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full px-4 py-3 text-zinc-900 dark:text-white mr-2"
            multiline
            maxLength={200}
          />
          <TouchableOpacity 
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            className={\`p-3 rounded-full \${input.trim() ? 'bg-zinc-900 dark:bg-white' : 'bg-zinc-200 dark:bg-zinc-800'}\`}
          >
            <Send size={20} className={input.trim() ? 'text-white dark:text-zinc-900' : 'text-zinc-400 dark:text-zinc-600'} />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
