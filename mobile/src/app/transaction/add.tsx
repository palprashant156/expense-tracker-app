import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Input, Button } from '../../components/ui';
import { useAddTransaction } from '../../hooks/useTransactions';

export default function AddTransactionModal() {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const { mutate: addTransaction, isPending, error } = useAddTransaction();

  const handleSave = () => {
    if (!amount) return;
    
    // In a real app, you'd fetch the selected category ID and account ID
    addTransaction({
      amount: parseInt(amount, 10),
      type,
      description,
      transactionDate: new Date().toISOString(),
      // Mock IDs to satisfy backend constraints for now
      categoryId: '00000000-0000-0000-0000-000000000000',
      accountId: '00000000-0000-0000-0000-000000000000',
    }, {
      onSuccess: () => {
        router.back();
      }
    });
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
            <View className={`flex-1 rounded-lg ${type === 'expense' ? 'bg-white dark:bg-zinc-800 shadow-sm' : ''}`}>
              <Pressable 
                onPress={() => setType('expense')}
                style={{ paddingVertical: 8, alignItems: 'center' }}
              >
                <Text className={`font-medium ${type === 'expense' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>Expense</Text>
              </Pressable>
            </View>
            <View className={`flex-1 rounded-lg ${type === 'income' ? 'bg-white dark:bg-zinc-800 shadow-sm' : ''}`}>
              <Pressable 
                onPress={() => setType('income')}
                style={{ paddingVertical: 8, alignItems: 'center' }}
              >
                <Text className={`font-medium ${type === 'income' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>Income</Text>
              </Pressable>
            </View>
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
              <View className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <Pressable style={{ paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text className={category ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}>
                    {category || 'Select Category'}
                  </Text>
                </Pressable>
              </View>
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

          {error && <Text className="text-red-500 mb-2">{error.message || 'Failed to add transaction'}</Text>}
          <Button 
            title={isPending ? "Saving..." : "Save Transaction"} 
            onPress={handleSave} 
            className="mt-4" 
            disabled={isPending || !amount} 
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
