import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Edit3, Trash2 } from 'lucide-react-native';
import { useTransaction, useDeleteTransaction } from '../../hooks/useTransactions';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const { data: transaction, isLoading, error } = useTransaction(id!);
  const { mutate: deleteTransaction, isPending: isDeleting } = useDeleteTransaction();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950 justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error || !transaction) {
    return (
      <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950 justify-center items-center">
        <Text className="text-red-500 mb-4">Transaction not found.</Text>
        <TouchableOpacity onPress={() => router.back()} className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg">
          <Text className="text-zinc-900 dark:text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const isIncome = transaction.type === 'income';
  const amount = transaction.amount;
  const title = transaction.merchant?.name || transaction.description || transaction.category?.name || 'Transaction';
  const category = transaction.category?.name || 'Uncategorized';
  const emoji = transaction.category?.icon || (isIncome ? '💰' : '🍔');
  const note = transaction.notes || transaction.description || 'No notes provided';
  
  const dateObj = new Date(transaction.transactionDate);
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' • ' + dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            deleteTransaction(transaction.id, {
              onSuccess: () => {
                router.back();
              },
              onError: () => {
                Alert.alert("Error", "Failed to delete transaction");
              }
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-zinc-900 dark:text-white">Detail</Text>
          <TouchableOpacity className="p-2" onPress={() => router.push(`/transactions/edit?id=${transaction.id}`)}>
            <Edit3 size={20} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View className="items-center mb-10">
          <View className="w-20 h-20 rounded-full bg-zinc-100 dark:bg-zinc-900 items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800">
            <Text className="text-4xl">{emoji}</Text>
          </View>
          <Text className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{title}</Text>
          <Text className={`text-4xl font-bold tracking-tight ${isIncome ? 'text-emerald-500' : 'text-zinc-900 dark:text-white'}`}>
            {isIncome ? '+' : '-'}₹{Number(amount).toLocaleString()}
          </Text>
        </View>

        {/* Details Card */}
        <View className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 space-y-6">
          <View className="flex-row justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Status</Text>
            <View className="bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
              <Text className="text-emerald-700 dark:text-emerald-400 text-xs font-semibold">Completed</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Date</Text>
            <Text className="text-sm font-semibold text-zinc-900 dark:text-white">{dateStr}</Text>
          </View>

          <View className="flex-row justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Category</Text>
            <Text className="text-sm font-semibold text-zinc-900 dark:text-white">{category}</Text>
          </View>

          <View className="flex-row justify-between items-center pb-2">
            <Text className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Note</Text>
            <Text className="text-sm font-semibold text-zinc-900 dark:text-white">{note}</Text>
          </View>
        </View>

        {/* Delete Button */}
        <TouchableOpacity 
          onPress={handleDelete}
          disabled={isDeleting}
          className={`mt-8 flex-row justify-center items-center py-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 ${isDeleting ? 'opacity-50' : ''}`}
        >
          <Trash2 size={20} className="text-red-500 mr-2" />
          <Text className="text-red-500 font-semibold">{isDeleting ? 'Deleting...' : 'Delete Transaction'}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
