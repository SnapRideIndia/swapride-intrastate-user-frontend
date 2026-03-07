import { handleErrorResponse, postData, refreshSession } from './ApiUtility';

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

    return res.data;
  };

  registerUser = async (payload: any) => {
    const url = `${this.baseUrl}/register`;
    const res = await postData(url, payload);

    console.log('this is the register api response ===>', res);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  logout = async (payload: any) => {
    const url = `${this.baseUrl}/logout`;
    const res = await postData(url, payload);

    console.log('this is the logout api response ===>', res);
    if (!res.success || !res.data) {
      handleErrorResponse(res);
    }

    return res.data;
  };

  /**
   * Refresh access token using refresh token (for sliding session).
   * Uses refreshSession from ApiUtility (no Bearer token sent).
   * Use via useRefreshToken hook or called automatically on 401 by API interceptor.
   */
  refreshAccessToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
    return refreshSession(refreshToken);
  };
}

export default new AuthService();
