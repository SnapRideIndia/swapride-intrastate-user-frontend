import { fetchData, handleErrorResponse, postData } from './ApiUtility';
import { API_ENDPOINTS } from './endpoints';
import type { DateFilterValue, PaymentFilter } from '../types/transactionFilters';

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

export type TransactionDetailSource = 'WALLET' | 'GATEWAY';

export type TransactionDetailDirection = 'CREDIT' | 'DEBIT';

export type TransactionDetailStatus = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REVERSED' | 'REFUNDED';

export type TransactionDetailType = 'BOOKING' | 'TOPUP' | 'ADJUSTMENT' | 'REFUND' | 'OTHER';

export type TransactionDetailPaymentMethod =
  | 'WALLET'
  | 'RAZORPAY'
  | 'PAYTM'
  | 'UPI'
  | 'CARD'
  | 'CASH'
  | 'OTHER';

export interface TransactionBookingSummary {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: string;
  pickupName?: string;
  dropName?: string;
}

export interface TransactionDetail {
  id: string;
  source: TransactionDetailSource;
  amount: string;
  direction: TransactionDetailDirection;
  currency: string;
  status: TransactionDetailStatus;
  type: TransactionDetailType;
  createdAt: string;
  updatedAt?: string;
  paymentMethod?: TransactionDetailPaymentMethod;
  gatewayOrderId?: string | null;
  transactionRefId?: string | null;
  balanceBefore?: string | null;
  balanceAfter?: string | null;
  title: string;
  description?: string | null;
  booking?: TransactionBookingSummary | null;
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

export type TransactionsQueryArgs = {
  filter: PaymentFilter;
  offset: number;
  limit: number;
  search?: string;
  datePreset?: DateFilterValue;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  type?: 'CREDIT' | 'DEBIT';
};

class WalletService {
  getBalance = async () => {
    const url = API_ENDPOINTS.WALLET.BALANCE;
    const res = await fetchData(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  getTransactions = async (args: TransactionsQueryArgs): Promise<TransactionsResponse> => {
    const params = new URLSearchParams();

    params.append('filter', args.filter);
    params.append('limit', String(args.limit));
    params.append('offset', String(args.offset));

    if (args.search && args.search.trim().length > 0) {
      params.append('search', args.search.trim());
    }
    if (args.datePreset) {
      params.append('datePreset', args.datePreset);
    }
    if (args.startDate) {
      params.append('startDate', args.startDate);
    }
    if (args.endDate) {
      params.append('endDate', args.endDate);
    }
    if (args.minAmount != null) {
      params.append('minAmount', String(args.minAmount));
    }
    if (args.maxAmount != null) {
      params.append('maxAmount', String(args.maxAmount));
    }
    if (args.type) {
      params.append('type', args.type);
    }

    const url = `${API_ENDPOINTS.WALLET.TRANSACTIONS}?${params.toString()}`;
    const res = await fetchData<TransactionsResponse>(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data as TransactionsResponse;
  };

  getTransactionDetail = async (id: string): Promise<TransactionDetail> => {
    const url = API_ENDPOINTS.WALLET.TRANSACTION_DETAIL(id);
    const res = await fetchData<TransactionDetail>(url);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }
    return res.data as TransactionDetail;
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
