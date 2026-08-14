import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Plus, ArrowRightLeft, TrendingUp, Bell, Sparkles } from 'lucide-react-native';
import { Card } from '../../components/ui';
import { useTransactions } from '../../hooks/useTransactions';
import { useUser } from '../../hooks/useAuth';

export default function DashboardScreen() {
  const { data: transactions, isLoading, error } = useTransactions();
  const { data: user } = useUser();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-2" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6 mt-4">
          <View>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 font-medium mb-1">Good Morning,</Text>
            <Text className="text-2xl font-bold text-zinc-900 dark:text-white">{user?.fullName || 'User'}</Text>
          </View>
          <TouchableOpacity className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900">
            <Bell size={20} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
        </View>

        {/* Total Balance Card */}
        <Card className="mb-6 bg-zinc-900 dark:bg-zinc-900 border-0 shadow-lg">
          <View className="flex-row justify-between items-start mb-4">
            <Text className="text-zinc-400 font-medium">Total Balance</Text>
            <View className="bg-zinc-800 px-2 py-1 rounded-md">
              <Text className="text-emerald-400 text-xs font-semibold">+2.4%</Text>
            </View>
          </View>
          <Text className="text-4xl font-bold text-white tracking-tight mb-6">₹1,24,500</Text>
          
          <View className="flex-row justify-between border-t border-zinc-800 pt-4">
            <View>
              <Text className="text-zinc-400 text-xs mb-1">Monthly Income</Text>
              <Text className="text-zinc-100 font-semibold">₹85,000</Text>
            </View>
            <View>
              <Text className="text-zinc-400 text-xs mb-1">Monthly Spend</Text>
              <Text className="text-zinc-100 font-semibold">₹32,400</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Quick Actions</Text>
        <View className="flex-row gap-3 mb-8">
          <TouchableOpacity 
            onPress={() => router.push('/transaction/add')}
            className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl items-center justify-center border border-zinc-100 dark:border-zinc-800"
          >
            <View className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-2">
              <Plus size={24} className="text-blue-600 dark:text-blue-400" />
            </View>
            <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Add Entry</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/transaction/transfer')}
            className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl items-center justify-center border border-zinc-100 dark:border-zinc-800"
          >
            <View className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-2">
              <ArrowRightLeft size={24} className="text-purple-600 dark:text-purple-400" />
            </View>
            <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/analytics')}
            className="flex-1 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl items-center justify-center border border-zinc-100 dark:border-zinc-800"
          >
            <View className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-2">
              <TrendingUp size={24} className="text-emerald-600 dark:text-emerald-400" />
            </View>
            <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Analysis</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-zinc-900 dark:text-white">Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/transactions')}>
            <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">See all</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-4 mb-8">
          {isLoading && (
            <View className="py-8 items-center">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          )}

          {error && (
            <View className="py-4 items-center">
              <Text className="text-red-500">Failed to load transactions. Is the backend running?</Text>
            </View>
          )}

          {!isLoading && !error && (!transactions || transactions.length === 0) && (
            <View className="py-8 items-center">
              <Text className="text-zinc-500">No transactions yet.</Text>
            </View>
          )}

          {!isLoading && transactions?.slice(0, 5).map((txn: any) => (
            <TouchableOpacity 
              key={txn.id}
              onPress={() => router.push(`/transactions/${txn.id}`)} 
              className="flex-row items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800"
            >
              <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${txn.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
                  <Text className="text-lg">{txn.category?.icon || (txn.type === 'income' ? '💰' : '🍔')}</Text>
                </View>
                <View>
                  <Text className="text-base font-semibold text-zinc-900 dark:text-white">
                    {txn.merchant?.name || txn.category?.name || 'Transaction'}
                  </Text>
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    {txn.category?.name} • {new Date(txn.transactionDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text className={`text-base font-semibold ${txn.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                {txn.type === 'income' ? '+' : '-'}₹{txn.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button for AI Chat */}
      <TouchableOpacity 
        onPress={() => router.push('/chat')}
        className="absolute bottom-6 right-6 w-14 h-14 bg-zinc-900 dark:bg-white rounded-full items-center justify-center shadow-lg shadow-black/30"
        activeOpacity={0.9}
      >
        <Sparkles size={24} className="text-white dark:text-zinc-900" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
