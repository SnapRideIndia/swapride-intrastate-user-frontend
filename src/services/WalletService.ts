import { fetchData, handleErrorResponse } from './ApiUtility';

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

  getTransactions = async (filter: string = 'ALL') => {
    const url = `/financials/transactions?filter=${filter}`;
    const res = await fetchData(url);

    console.log('Transactions API response ===>', res);

    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };
}

export default new WalletService();
