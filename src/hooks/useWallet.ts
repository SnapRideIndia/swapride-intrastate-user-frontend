import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import WalletService from '../services/WalletService';
import RazorpayService from '../services/RazorpayService';

export const useBalance = () => {
  return useQuery({
    queryKey: ['wallet-balance'],
    queryFn: WalletService.getBalance,
  });
};

export const useTransactions = (filter: string = 'ALL') => {
  return useInfiniteQuery({
    queryKey: ['wallet-transactions', filter],
    queryFn: ({ pageParam = 0 }) =>
      WalletService.getTransactions(filter, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: lastPage => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.pagination.limit;
      }
      return undefined;
    },
  });
};

interface UseTopUpOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useInitiateTopUp = ({
  onSuccess,
  onError,
}: UseTopUpOptions = {}) => {
  const queryClient = useQueryClient();
  const profileData = queryClient.getQueryData<any>(['currentProfile']);

  return useMutation({
    mutationFn: (amount: number) => WalletService.initiateTopUp(amount),
    onSuccess: async data => {
      const { gatewayData, topUpId } = data;

      try {
        await RazorpayService.openCheckout({
          keyId: gatewayData.razorpayKeyId,
          amount: gatewayData.amount,
          currency: gatewayData.currency,
          orderId: gatewayData.razorpayOrderId,
          name: 'SwapRide',
          description: `Wallet Top-up – ${topUpId}`,
          prefill: {
            name: profileData?.fullName || '',
            email: profileData?.emailAddress || '',
            contact: profileData?.mobileNumber || '',
          },
        });

        // Refresh balance and transactions after successful payment
        await queryClient.invalidateQueries({ queryKey: ['wallet-balance'] });
        await queryClient.invalidateQueries({
          queryKey: ['wallet-transactions'],
        });

        onSuccess?.();
      } catch (err: any) {
        const cancelled = RazorpayService.isCancellation(err);
        console.log(
          cancelled
            ? 'RazorpayService: user cancelled payment'
            : 'RazorpayService: payment failed',
          err,
        );
        onError?.(err);
      }
    },
    onError: err => {
      console.log('TopUp initiate API error ===>', err);
      onError?.(err);
    },
  });
};
