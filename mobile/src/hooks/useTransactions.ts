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
