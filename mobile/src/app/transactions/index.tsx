import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Filter, ChevronLeft } from 'lucide-react-native';
import { useTransactions } from '../../hooks/useTransactions';

export default function TransactionListScreen() {
  const [search, setSearch] = useState('');
  const { data: transactions, isLoading, error } = useTransactions();

  const filteredTransactions = transactions?.filter(txn => 
    (txn.description?.toLowerCase() || '').includes(search.toLowerCase()) || 
    (txn.category?.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      onPress={() => router.push(`/transactions/${item.id}`)}
      className="flex-row items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 mb-3 rounded-2xl border border-zinc-100 dark:border-zinc-800"
    >
      <View className="flex-row items-center">
        <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${item.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}`}>
          <Text className="text-xl">{item.category?.icon || (item.type === 'income' ? '💰' : '🍔')}</Text>
        </View>
        <View>
          <Text className="text-base font-semibold text-zinc-900 dark:text-white">
            {item.merchant?.name || item.description || item.category?.name || 'Transaction'}
          </Text>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400">
            {item.category?.name || 'Uncategorized'} • {new Date(item.transactionDate).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Text className={`text-base font-semibold ${item.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
        {item.type === 'income' ? '+' : '-'}₹{Number(item.amount).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-zinc-900 dark:text-white">All Transactions</Text>
          <View className="w-10" />
        </View>

        {/* Search & Filter */}
        <View className="flex-row gap-3 mb-6">
          <View className="flex-1 flex-row items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl px-4 py-3 border border-zinc-200 dark:border-zinc-800">
            <Search size={20} className="text-zinc-400 mr-2" />
            <TextInput
              className="flex-1 text-zinc-900 dark:text-white font-medium"
              placeholder="Search..."
              placeholderTextColor="#a1a1aa"
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <TouchableOpacity className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 items-center justify-center">
            <Filter size={20} className="text-zinc-900 dark:text-white" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-500">Failed to load transactions</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <View className="py-8 items-center">
                <Text className="text-zinc-500">No transactions found.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
