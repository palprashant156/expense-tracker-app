import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Activity, Target } from 'lucide-react-native';

export default function GoalsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        
        <View className="mb-6">
          <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Health & Goals</Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Track your financial well-being
          </Text>
        </View>

        {/* Health Score Widget */}
        <View className="bg-zinc-900 dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-800 mb-6 relative overflow-hidden">
          <View className="absolute -top-10 -right-10 opacity-10">
            <Activity size={120} color="#34d399" />
          </View>
          
          <Text className="text-zinc-400 font-medium mb-4">Financial Health Score</Text>
          <View className="flex-row items-end mb-4">
            <Text className="text-6xl font-black text-emerald-400 tracking-tighter">84</Text>
            <Text className="text-zinc-500 mb-2 ml-1">/100</Text>
          </View>
          <Text className="text-zinc-300 text-sm leading-relaxed">
            Excellent! Your savings rate has increased by 5% this month, and you've stayed within budget on dining.
          </Text>
        </View>

        {/* Goals Section */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-bold text-zinc-900 dark:text-white">Active Goals</Text>
        </View>

        {/* Goal 1 */}
        <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-3">
                <Text className="text-blue-600 dark:text-blue-400 text-lg">🏖️</Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-zinc-900 dark:text-white">Bali Vacation</Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">₹80,000 left to go</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-zinc-900 dark:text-white">₹40,000</Text>
          </View>

          {/* Progress bar */}
          <View className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-blue-500 rounded-full" style={{ width: '33%' }} />
          </View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400 text-right">33% achieved</Text>
        </View>

        {/* Goal 2 */}
        <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 items-center justify-center mr-3">
                <Text className="text-purple-600 dark:text-purple-400 text-lg">💻</Text>
              </View>
              <View>
                <Text className="text-base font-semibold text-zinc-900 dark:text-white">New MacBook Pro</Text>
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">₹30,000 left to go</Text>
              </View>
            </View>
            <Text className="text-sm font-bold text-zinc-900 dark:text-white">₹1,70,000</Text>
          </View>

          {/* Progress bar */}
          <View className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mb-2">
            <View className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
          </View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400 text-right">85% achieved</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
