import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Transaction {
  id: string;
  amount: string; // BigInt from backend comes as string sometimes, or number
  type: 'expense' | 'income' | 'transfer';
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  merchant?: {
    name: string;
  };
  transactionDate: string;
  description?: string;
}

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const response = await api.get('/transactions');
      return response.data.items || response.data;
    },
  });
};

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionData: any) => {
      const response = await api.post('/transactions', transactionData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch transactions after a new one is added
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Invalidate accounts/balance to update the dashboard
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await api.get('/accounts');
      return response.data;
    },
  });
};

export const useTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transferData: any) => {
      const response = await api.post('/transactions/transfer', transferData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useTransaction = (id: string) => {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: async (): Promise<Transaction> => {
      const response = await api.get(`/transactions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/transactions/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });
};
