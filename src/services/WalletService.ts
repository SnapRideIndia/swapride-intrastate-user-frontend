import { fetchData, handleErrorResponse, postData } from './ApiUtility';

export interface Transaction {
  id: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  source: string;
  description: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  date: string;
  referenceId: string;
  balanceBefore?: number;
  balanceAfter?: number;
}

export interface TransactionPagination {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface TransactionsResponse {
  data: Transaction[];
  pagination: TransactionPagination;
}

export interface TopUpGatewayData {
  orderId: string;
  amount: number;
  currency: string;
  gatewayOrderId: string;
  razorpayOrderId: string;
  razorpayKeyId: string;
}

export interface TopUpResponse {
  topUpId: string;
  amount: number;
  gatewayData: TopUpGatewayData;
}

class WalletService {
  baseUrl = '/wallet';

  getBalance = async () => {
    const url = `${this.baseUrl}/balance`;
    const res = await fetchData(url);

    console.log('Balance API response ===>', res);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  getTransactions = async (
    filter: string = 'ALL',
    offset: number = 0,
    limit: number = 20,
  ): Promise<TransactionsResponse> => {
    const url = `/financials/transactions?filter=${filter}&limit=${limit}&offset=${offset}`;
    const res = await fetchData<TransactionsResponse>(url);

    console.log('Transactions API response ===>', res);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as TransactionsResponse;
  };

  initiateTopUp = async (amount: number): Promise<TopUpResponse> => {
    const url = `${this.baseUrl}/topup/initiate`;
    const res = await postData<TopUpResponse>(url, { amount });

    console.log('TopUp initiate response ===>', res);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as TopUpResponse;
  };
}

export default new WalletService();
