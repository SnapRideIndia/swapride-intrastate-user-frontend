import { useQuery } from '@tanstack/react-query';
import WalletService from '../services/WalletService';

export const useBalance = () => {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: WalletService.getBalance,
  });
};

export const useTransactions = (filter: string = 'ALL') => {
  return useQuery({
    queryKey: ['wallet-transactions', filter],
    queryFn: () => WalletService.getTransactions(filter),
  });
};
