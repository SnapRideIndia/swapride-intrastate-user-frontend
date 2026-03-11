import { fetchData, handleErrorResponse, postData } from './ApiUtility';
import { API_ENDPOINTS } from './endpoints';

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
  getBalance = async () => {
    const url = API_ENDPOINTS.WALLET.BALANCE;
    const res = await fetchData(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  getTransactions = async (filter: string = 'ALL', offset: number = 0, limit: number = 20): Promise<TransactionsResponse> => {
    const url = `${API_ENDPOINTS.WALLET.TRANSACTIONS}?filter=${filter}&limit=${limit}&offset=${offset}`;
    const res = await fetchData<TransactionsResponse>(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    console.log('Transactions ==>,', res.data);
    return res.data as TransactionsResponse;
  };

  initiateTopUp = async (amount: number): Promise<TopUpResponse> => {
    const url = API_ENDPOINTS.WALLET.TOPUP_INITIATE;
    const res = await postData<TopUpResponse>(url, { amount });

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as TopUpResponse;
  };
}

export default new WalletService();
