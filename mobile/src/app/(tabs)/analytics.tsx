import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart, LineChart } from 'react-native-gifted-charts';

export default function AnalyticsScreen() {
  const pieData = [
    { value: 45, color: '#3b82f6', text: '45%' }, // Blue (Housing)
    { value: 25, color: '#10b981', text: '25%' }, // Emerald (Food)
    { value: 20, color: '#f59e0b', text: '20%' }, // Amber (Transport)
    { value: 10, color: '#8b5cf6', text: '10%' }, // Violet (Entertainment)
  ];

  const lineData = [
    { value: 2500, label: 'Mon' },
    { value: 1200, label: 'Tue' },
    { value: 3800, label: 'Wed' },
    { value: 900, label: 'Thu' },
    { value: 4100, label: 'Fri' },
    { value: 6500, label: 'Sat' },
    { value: 1800, label: 'Sun' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-zinc-900 dark:text-white">Analytics</Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Understanding your cash flow
          </Text>
        </View>

        {/* Weekly Trend (Line Chart) */}
        <View className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 mb-6">
          <Text className="text-base font-semibold text-zinc-900 dark:text-white mb-6">Weekly Spend</Text>
          <View className="items-center">
            <LineChart
              data={lineData}
              width={280}
              height={180}
              thickness={3}
              color="#10b981"
              hideRules
              hideDataPoints
              yAxisColor="transparent"
              xAxisColor="transparent"
              yAxisTextStyle={{ color: '#71717a', fontSize: 10 }}
              xAxisLabelTextStyle={{ color: '#71717a', fontSize: 10 }}
              curved
              initialSpacing={10}
            />
          </View>
        </View>

        {/* Category Breakdown (Pie Chart) */}
        <View className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 mb-8">
          <Text className="text-base font-semibold text-zinc-900 dark:text-white mb-6">Category Breakdown</Text>
          <View className="flex-row items-center justify-between">
            <PieChart
              data={pieData}
              donut
              innerRadius={50}
              radius={80}
              innerCircleColor="transparent"
            />
            
            <View className="flex-1 ml-6 space-y-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                  <Text className="text-sm text-zinc-700 dark:text-zinc-300">Housing</Text>
                </View>
                <Text className="text-sm font-semibold text-zinc-900 dark:text-white">45%</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                  <Text className="text-sm text-zinc-700 dark:text-zinc-300">Food</Text>
                </View>
                <Text className="text-sm font-semibold text-zinc-900 dark:text-white">25%</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                  <Text className="text-sm text-zinc-700 dark:text-zinc-300">Transport</Text>
                </View>
                <Text className="text-sm font-semibold text-zinc-900 dark:text-white">20%</Text>
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 rounded-full bg-violet-500 mr-2" />
                  <Text className="text-sm text-zinc-700 dark:text-zinc-300">Entertainment</Text>
                </View>
                <Text className="text-sm font-semibold text-zinc-900 dark:text-white">10%</Text>
              </View>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
