import '../global.css';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="transaction/add" 
          options={{ 
            headerShown: true, 
            title: 'New Transaction',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
            },
            headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
            headerShadowVisible: false,
          }} 
        />
        <Stack.Screen 
          name="transaction/transfer" 
          options={{ 
            headerShown: true, 
            title: 'Transfer',
            headerStyle: {
              backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
            },
            headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
            headerShadowVisible: false,
          }} 
        />
        <Stack.Screen 
          name="chat/index" 
          options={{ 
            presentation: 'fullScreenModal',
            headerShown: false,
            animation: 'slide_from_bottom',
          }} 
        />
      </Stack>
    </QueryClientProvider>
  );
}
