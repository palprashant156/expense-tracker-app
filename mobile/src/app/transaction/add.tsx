import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Input, Button } from '../../components/ui';

export default function AddTransactionModal() {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    // Save logic mock
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView className="flex-1 px-4 pt-4">
          
          {/* Type Toggle */}
          <View className="flex-row bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 mb-8">
            <TouchableOpacity 
              onPress={() => setType('expense')}
              className={\`flex-1 py-2 items-center rounded-lg \${type === 'expense' ? 'bg-white dark:bg-zinc-800 shadow-sm' : ''}\`}
            >
              <Text className={\`font-medium \${type === 'expense' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}\`}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setType('income')}
              className={\`flex-1 py-2 items-center rounded-lg \${type === 'income' ? 'bg-white dark:bg-zinc-800 shadow-sm' : ''}\`}
            >
              <Text className={\`font-medium \${type === 'income' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}\`}>Income</Text>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="items-center mb-8">
            <Text className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">Amount</Text>
            <View className="flex-row items-center">
              <Text className="text-4xl font-bold text-zinc-900 dark:text-white mr-1">₹</Text>
              <Input 
                value={amount}
                onChangeText={setAmount}
                placeholder="0"
                keyboardType="numeric"
                className="text-5xl font-bold text-zinc-900 dark:text-white bg-transparent border-0 text-center min-w-[100px]"
              />
            </View>
          </View>

          <View className="space-y-4 mb-8">
            {/* Category */}
            <View>
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 ml-1">Category</Text>
              <TouchableOpacity className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-4 flex-row justify-between items-center">
                <Text className={category ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}>
                  {category || 'Select Category'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Note */}
            <View>
              <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 ml-1">Note (Optional)</Text>
              <Input 
                placeholder="What was this for?" 
                value={description}
                onChangeText={setDescription}
              />
            </View>
          </View>

          <Button title="Save Transaction" onPress={handleSave} className="mt-4" />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
