import React from 'react';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <View className={`bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 ${className}`}>
      {children}
    </View>
  );
}

export function Button({ onPress, title, variant = 'primary', className = '' }: { onPress: () => void; title: string; variant?: 'primary' | 'secondary' | 'outline'; className?: string }) {
  const baseStyles = 'rounded-xl py-3 px-4 items-center justify-center flex-row';
  
  const variants = {
    primary: 'bg-zinc-900 dark:bg-zinc-50',
    secondary: 'bg-zinc-100 dark:bg-zinc-800',
    outline: 'bg-transparent border border-zinc-200 dark:border-zinc-700',
  };

  const textVariants = {
    primary: 'text-white dark:text-zinc-900 font-semibold',
    secondary: 'text-zinc-900 dark:text-zinc-50 font-medium',
    outline: 'text-zinc-900 dark:text-zinc-50 font-medium',
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      activeOpacity={0.8}
    >
      <Text className={textVariants[variant]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function Input({ placeholder, value, onChangeText, secureTextEntry, className = '' }: any) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#a1a1aa" // zinc-400
      className={`bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-50 ${className}`}
    />
  );
}
