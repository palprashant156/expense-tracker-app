import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Input, Button } from '../../components/ui';
import { Tag, CreditCard, ChevronDown, X } from 'lucide-react-native';
import { useAddTransaction, useAccounts, useCategories } from '../../hooks/useTransactions';

const AccountPickerModal = ({ visible, onClose, onSelect, accounts }: any) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white dark:bg-zinc-950 rounded-t-3xl p-6 min-h-[50%]">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-zinc-900 dark:text-white">Select Account</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} className="text-zinc-500" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {accounts.map((acc: any) => (
            <TouchableOpacity 
              key={acc.id} 
              className="py-4 border-b border-zinc-100 dark:border-zinc-800"
              onPress={() => { onSelect(acc.id); onClose(); }}
            >
              <Text className="text-lg font-medium text-zinc-900 dark:text-white">{acc.name}</Text>
              <Text className="text-sm text-zinc-500">₹{acc.balance.toString()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const CategoryPickerModal = ({ visible, onClose, onSelect, categories }: any) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white dark:bg-zinc-950 rounded-t-3xl p-6 min-h-[50%]">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-zinc-900 dark:text-white">Select Category</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <X size={24} className="text-zinc-500" />
          </TouchableOpacity>
        </View>
        <ScrollView>
          {categories.length === 0 && (
            <Text className="text-zinc-500 text-center py-4">No categories found for this type.</Text>
          )}
          {categories.map((cat: any) => (
            <TouchableOpacity 
              key={cat.id} 
              className="py-4 border-b border-zinc-100 dark:border-zinc-800 flex-row items-center"
              onPress={() => { onSelect(cat.id); onClose(); }}
            >
              <View className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 items-center justify-center mr-3">
                <Text className="text-xl">{cat.icon}</Text>
              </View>
              <Text className="text-lg font-medium text-zinc-900 dark:text-white">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default function AddTransactionModal() {
  const { data: accounts = [] } = useAccounts();
  const { data: allCategories = [] } = useCategories();
  const { mutate: addTransaction, isPending, error } = useAddTransaction();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [accountId, setAccountId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  // Initialize with defaults if available
  if (accounts.length > 0 && !accountId) {
    setAccountId(accounts[0].id);
  }

  // Filter categories based on selected type
  const filteredCategories = allCategories.filter((cat: any) => cat.type === type);
  
  // Set default category if none is selected for the current type
  if (filteredCategories.length > 0 && (!categoryId || !filteredCategories.find((c: any) => c.id === categoryId))) {
    setCategoryId(filteredCategories[0].id);
  }

  const handleSave = () => {
    if (!amount || !accountId || !categoryId) return;
    
    addTransaction({
      amount: Number(amount),
      type,
      description,
      accountId,
      transactionDate: new Date().toISOString(),
      categoryId,
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
          
          <View className="flex-row bg-zinc-100 dark:bg-zinc-900 rounded-xl p-1 mb-8">
            <View className={`flex-1 rounded-lg ${type === 'expense' ? 'bg-white dark:bg-zinc-800 shadow-sm' : ''}`}>
              <Pressable onPress={() => setType('expense')} style={{ paddingVertical: 8, alignItems: 'center' }}>
                <Text className={`font-medium ${type === 'expense' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>Expense</Text>
              </Pressable>
            </View>
            <View className={`flex-1 rounded-lg ${type === 'income' ? 'bg-white dark:bg-zinc-800 shadow-sm' : ''}`}>
              <Pressable onPress={() => setType('income')} style={{ paddingVertical: 8, alignItems: 'center' }}>
                <Text className={`font-medium ${type === 'income' ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'}`}>Income</Text>
              </Pressable>
            </View>
          </View>

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

          <View className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl mb-8 overflow-hidden">
            <TouchableOpacity 
              className="flex-row items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800"
              onPress={() => setShowCategoryPicker(true)}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-3">
                  <Tag size={20} className="text-blue-600 dark:text-blue-400" />
                </View>
                <Text className="text-base text-zinc-900 dark:text-white font-medium">Category</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-zinc-500 dark:text-zinc-400 mr-2">
                  {allCategories.find((c: any) => c.id === categoryId)?.name || 'Select'}
                </Text>
                <ChevronDown size={16} className="text-zinc-400" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="flex-row items-center justify-between p-4"
              onPress={() => setShowAccountPicker(true)}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 items-center justify-center mr-3">
                  <CreditCard size={20} className="text-indigo-600 dark:text-indigo-400" />
                </View>
                <Text className="text-base text-zinc-900 dark:text-white font-medium">Account</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-zinc-500 dark:text-zinc-400 mr-2">
                  {accounts.find((a: any) => a.id === accountId)?.name || 'Select'}
                </Text>
                <ChevronDown size={16} className="text-zinc-400" />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mb-8">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 ml-1">Note (Optional)</Text>
            <Input 
              placeholder="What was this for?" 
              value={description}
              onChangeText={setDescription}
            />
          </View>

          {error && <Text className="text-red-500 mb-2">{error.message || 'Failed to add transaction'}</Text>}
          <Button 
            title={isPending ? "Saving..." : "Save Transaction"} 
            onPress={handleSave} 
            className="mt-4" 
            disabled={isPending || !amount || !accountId || !categoryId} 
          />
        </ScrollView>
        <AccountPickerModal 
          visible={showAccountPicker} 
          onClose={() => setShowAccountPicker(false)} 
          onSelect={setAccountId} 
          accounts={accounts} 
        />
        <CategoryPickerModal 
          visible={showCategoryPicker} 
          onClose={() => setShowCategoryPicker(false)} 
          onSelect={setCategoryId} 
          categories={filteredCategories} 
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
