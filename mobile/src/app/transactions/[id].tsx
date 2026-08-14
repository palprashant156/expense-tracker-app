import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ChevronLeft, Edit3, Trash2 } from 'lucide-react-native';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams();

  // Mock data resolution based on ID
  const isIncome = id === '2';
  const amount = isIncome ? 85000 : 850;
  const title = isIncome ? 'Salary' : 'Zomato';
  const category = isIncome ? 'Income' : 'Dining';
  const emoji = isIncome ? '💰' : '🍔';
  const note = isIncome ? 'August Salary from Acme Corp' : 'Dinner with friends';
  
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
          <Text className="text-base font-bold text-zinc-900 dark:text-white">Detail</Text>
          <TouchableOpacity className="p-2">
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
            {isIncome ? '+' : '-'}₹{amount.toLocaleString()}
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
            <Text className="text-sm font-semibold text-zinc-900 dark:text-white">August 12, 2026 • 19:42</Text>
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
        <TouchableOpacity className="mt-8 flex-row justify-center items-center py-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
          <Trash2 size={20} className="text-red-500 mr-2" />
          <Text className="text-red-500 font-semibold">Delete Transaction</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
