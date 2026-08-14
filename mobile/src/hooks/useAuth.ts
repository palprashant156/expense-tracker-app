import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { setTokens, removeTokens } from '../lib/auth';
import { router } from 'expo-router';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: async (data) => {
      // Save tokens
      await setTokens(data.accessToken, data.refreshToken);
      
      // Update query client with user data if needed
      if (data.user) {
        queryClient.setQueryData(['user'], data.user);
      }
      
      // Navigate to the main app
      router.replace('/(tabs)');
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await api.post('/auth/register', userData);
      return response.data;
    },
    onSuccess: async (data) => {
      // Save tokens
      await setTokens(data.accessToken, data.refreshToken);
      
      if (data.user) {
        queryClient.setQueryData(['user'], data.user);
      }
      
      router.replace('/(tabs)');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Optional: Call backend to revoke token
      try {
        await api.post('/auth/logout');
      } catch (e) {
        console.warn('Logout API failed, continuing with local logout', e);
      }
    },
    onSettled: async () => {
      // Remove tokens locally
      await removeTokens();
      
      // Clear all react-query cache
      queryClient.clear();
      
      // Navigate back to login
      router.replace('/login');
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
  });
};
