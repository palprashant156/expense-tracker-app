import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Moon, Shield, CircleHelp, LogOut, ChevronRight, Bell } from 'lucide-react-native';
import { router } from 'expo-router';
import { useLogout, useUser } from '../../hooks/useAuth';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const { data: user } = useUser();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);

  const handleLogout = () => {
    // Navigate back to login
    router.replace('/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950">
      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-zinc-900 dark:text-white mb-6">Settings</Text>

        {/* Profile Card */}
        <View className="bg-white dark:bg-zinc-900 rounded-2xl p-4 mb-8 flex-row items-center shadow-sm border border-zinc-100 dark:border-zinc-800">
          <View className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 items-center justify-center mr-4">
            <Text className="text-blue-600 dark:text-blue-400 text-xl font-bold">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold text-zinc-900 dark:text-white">{user?.fullName || 'User'}</Text>
            <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-full">
            <User size={20} className="text-zinc-700 dark:text-zinc-300" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 ml-2">Preferences</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-8 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="flex-row items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center mr-4">
                <Moon size={20} className="text-zinc-700 dark:text-zinc-300" />
              </View>
              <Text className="text-base font-medium text-zinc-900 dark:text-white">Dark Mode</Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#e4e4e7', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>

          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center mr-4">
                <Bell size={20} className="text-zinc-700 dark:text-zinc-300" />
              </View>
              <Text className="text-base font-medium text-zinc-900 dark:text-white">Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e4e4e7', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Security Section */}
        <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 ml-2">Security</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-8 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center mr-4">
                <Shield size={20} className="text-zinc-700 dark:text-zinc-300" />
              </View>
              <Text className="text-base font-medium text-zinc-900 dark:text-white">Face ID Authentication</Text>
            </View>
            <Switch 
              value={faceIdEnabled} 
              onValueChange={setFaceIdEnabled}
              trackColor={{ false: '#e4e4e7', true: '#3b82f6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* Support Section */}
        <Text className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 ml-2">Support</Text>
        <View className="bg-white dark:bg-zinc-900 rounded-2xl mb-8 shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
          <TouchableOpacity className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 items-center justify-center mr-4">
                <CircleHelp size={20} className="text-zinc-700 dark:text-zinc-300" />
              </View>
              <Text className="text-base font-medium text-zinc-900 dark:text-white">Help Center</Text>
            </View>
            <ChevronRight size={20} className="text-zinc-400" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 flex-row items-center justify-center mb-12 border border-red-100 dark:border-red-900/30"
        >
          <LogOut size={20} className="text-red-600 dark:text-red-400 mr-2" />
          <Text className="text-base font-bold text-red-600 dark:text-red-400">Sign Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
