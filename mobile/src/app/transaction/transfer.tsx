import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Input, Button } from '../../components/ui';
import { ArrowDown, X } from 'lucide-react-native';
import { useAccounts, useTransfer } from '../../hooks/useTransactions';
import { Modal } from 'react-native';

const AccountPickerModal = ({ visible, onClose, onSelect, title, accounts }: any) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white dark:bg-zinc-950 rounded-t-3xl p-6 min-h-[50%]">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-zinc-900 dark:text-white">{title}</Text>
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

export default function TransferModal() {
  const { data: accounts = [] } = useAccounts();
  const { mutate: transfer, isPending } = useTransfer();
  
  const [amount, setAmount] = useState('');
  const [sourceAccountId, setSourceAccountId] = useState('');
  const [destAccountId, setDestAccountId] = useState('');
  const [description, setDescription] = useState('');
  
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showDestPicker, setShowDestPicker] = useState(false);

  // Initialize with defaults if available
  if (accounts.length > 0 && !sourceAccountId) {
    setSourceAccountId(accounts[0].id);
  }

  const handleSave = () => {
    if (!amount || !sourceAccountId || !destAccountId) {
      alert('Please fill all required fields');
      return;
    }
    transfer({ 
      sourceAccountId, 
      destAccountId, 
      amount: Number(amount), 
      description 
    }, {
      onSuccess: () => router.back()
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView className="flex-1 px-4 pt-6">
          
          {/* Amount Input */}
          <View className="items-center mb-10">
            <Text className="text-zinc-500 dark:text-zinc-400 font-medium mb-2">Transfer Amount</Text>
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

          {/* Account Selectors */}
          <View className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 mb-6 relative z-0">
            <View className="mb-4">
              <Text className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">From Account</Text>
              <View>
                <TouchableOpacity style={{ paddingVertical: 4 }} onPress={() => setShowSourcePicker(true)}>
                  <Text className="text-lg font-medium text-zinc-900 dark:text-white">
                    {accounts.find((a: any) => a.id === sourceAccountId)?.name || 'Select Account'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="absolute left-6 top-1/2 -mt-4 bg-white dark:bg-zinc-950 p-1.5 rounded-full z-10 border border-zinc-200 dark:border-zinc-800">
              <ArrowDown size={16} className="text-zinc-500" />
            </View>

            <View className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <Text className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">To Account</Text>
              <View>
                <TouchableOpacity style={{ paddingVertical: 4 }} onPress={() => setShowDestPicker(true)}>
                  <Text className="text-lg font-medium text-zinc-900 dark:text-white">
                    {accounts.find((a: any) => a.id === destAccountId)?.name || 'Select Account'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Note */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 ml-1">Note (Optional)</Text>
            <Input 
              placeholder="E.g., Transfer to savings" 
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <Button title={isPending ? "Transferring..." : "Confirm Transfer"} onPress={handleSave} className="mt-4" disabled={isPending} />
        </ScrollView>
        <AccountPickerModal visible={showSourcePicker} onClose={() => setShowSourcePicker(false)} onSelect={setSourceAccountId} title="From Account" accounts={accounts} />
        <AccountPickerModal visible={showDestPicker} onClose={() => setShowDestPicker(false)} onSelect={setDestAccountId} title="To Account" accounts={accounts} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
