import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Link, router } from 'expo-router';
import { Button, Input } from '../../components/ui';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate to tabs on mock login
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-10">
          <Text className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Welcome back</Text>
          <Text className="text-base text-zinc-500 dark:text-zinc-400">
            Sign in to track your financial intelligence.
          </Text>
        </View>

        <View className="space-y-4 mb-8">
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email</Text>
            <Input 
              placeholder="you@example.com" 
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View className="mb-2">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Password</Text>
            <Input 
              placeholder="••••••••" 
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity className="self-end mb-4">
            <Text className="text-sm font-medium text-zinc-900 dark:text-zinc-300">Forgot password?</Text>
          </TouchableOpacity>

          <Button title="Sign In" onPress={handleLogin} />
        </View>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-zinc-500 dark:text-zinc-400">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-zinc-900 dark:text-white font-semibold">Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
