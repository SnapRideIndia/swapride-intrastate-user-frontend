import { handleErrorResponse, postData } from './ApiUtility';

class AuthService {
  baseUrl = '/users/auth';

  sendOTP = async (payload: any) => {
    const url = `${this.baseUrl}/send-otp`;
    const res = await postData(url, payload);

    console.log('this is the login api response ===>', res);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data.data;
  };

  verifyOTP = async (payload: any) => {
    const url = `${this.baseUrl}/verify-otp`;
    const res = await postData(url, payload);

    console.log('this is the login api response ===>', res);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data.data;
  };
}


export default new AuthService();