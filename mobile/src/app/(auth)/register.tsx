import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Button, Input } from '../../components/ui';
import { useRegister } from '../../hooks/useAuth';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { mutate: register, isPending, error } = useRegister();

  const handleRegister = () => {
    register({ fullName, email, password });
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-zinc-950">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <View className="mb-10 mt-6">
          <Text className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Create account</Text>
          <Text className="text-base text-zinc-500 dark:text-zinc-400">
            Start mastering your finances today.
          </Text>
        </View>

        <View className="space-y-4 mb-8">
          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Full Name</Text>
            <Input 
              placeholder="Jane Doe" 
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Email</Text>
            <Input 
              placeholder="you@example.com" 
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View className="mb-6">
            <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 ml-1">Password</Text>
            <Input 
              placeholder="••••••••" 
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {error && <Text className="text-red-500 mb-2">{error.message || 'Registration failed'}</Text>}
          <Button 
            title={isPending ? "Creating Account..." : "Create Account"} 
            onPress={handleRegister} 
            disabled={isPending} 
          />
        </View>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-zinc-500 dark:text-zinc-400">Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-zinc-900 dark:text-white font-semibold">Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
