import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function EditTransactionPlaceholder() {
  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="flex-row items-center justify-between px-4 pt-4 mb-8">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft size={24} className="text-zinc-900 dark:text-white" />
        </TouchableOpacity>
        <Text className="text-base font-bold text-zinc-900 dark:text-white">Edit</Text>
        <View className="w-10" />
      </View>
      <View className="flex-1 items-center justify-center px-4">
        <Text className="text-xl font-bold text-zinc-900 dark:text-white text-center mb-4">
          Edit functionality coming soon!
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 text-center">
          The backend API for updates is fully ready, but the UI form is still under construction. Check back later!
        </Text>
      </View>
    </SafeAreaView>
  );
}
