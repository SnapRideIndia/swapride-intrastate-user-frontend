import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { storage } from '../utils/store';
import { StorageKeys } from '../constants/storage/storageKeys';

// Base configuration
// http://swapride-intrastate-staging-env-1.eba-hgachq5q.ap-south-2.elasticbeanstalk.com/api
// https://c847hsc39h.execute-api.ap-south-2.amazonaws.com/api#/
const BASE_URL = 'https://c847hsc39h.execute-api.ap-south-2.amazonaws.com/';
// AIzaSyCtC_0HfLwBvG3KRI2ZAcAyQqRrkJSeKSE
const TIMEOUT = 120000;

// Types
export interface ApiResponse<T = any> {
  data: T | null;
  status: number;
  success: boolean;
  error?: string;
}

// Helper: Create axios instance
const createAxiosInstance = (contentType: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
      'Content-Type': contentType,
      Accept: 'application/json',
    },
  });

  // Request interceptor: attach token
  instance.interceptors.request.use(
    async config => {
      const token = await storage.getString(StorageKeys.ACCESS_TOKEN);
      console.log('this is access token inside the apiutility file ===>', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error),
  );

  return instance;
};

// Instance used only for refresh call (no Authorization header)
const noAuthApi = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const REFRESH_ENDPOINT = 'users/auth/refresh';

/** Single in-flight refresh promise so concurrent 401s trigger only one refresh */
let refreshPromise: Promise<string | null> | null = null;

/**
 * Call refresh API (no Bearer token), save new tokens to MMKV, return new access token.
 * Used by 401 interceptor and by AuthService.refreshAccessToken.
 */
export const refreshSession = async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
  const { data } = await noAuthApi.post<{
    data?: { accessToken?: string; access_token?: string; refreshToken?: string; refresh_token?: string };
    accessToken?: string;
    refreshToken?: string;
  }>(REFRESH_ENDPOINT, { refreshToken });
  const raw = data?.data ?? data;
  const accessToken = raw?.accessToken ?? raw?.access_token ?? '';
  const newRefreshToken = raw?.refreshToken ?? raw?.refresh_token;
  if (!accessToken) {
    throw new Error('Refresh failed: no access token in response');
  }
  storage.set(StorageKeys.ACCESS_TOKEN, accessToken);
  if (newRefreshToken) {
    storage.set(StorageKeys.REFRESH_TOKEN, newRefreshToken);
  }
  return { accessToken, refreshToken: newRefreshToken };
};

const attachResponseInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }
      if (originalRequest.url?.includes(REFRESH_ENDPOINT)) {
        return Promise.reject(error);
      }
      const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN);
      if (!refreshToken) {
        return Promise.reject(error);
      }
      try {
        if (!refreshPromise) {
          refreshPromise = refreshSession(refreshToken)
            .then(r => r.accessToken)
            .catch(() => null);
        }
        const newAccessToken = await refreshPromise;
        refreshPromise = null;
        if (!newAccessToken) {
          storage.delete(StorageKeys.ACCESS_TOKEN);
          storage.delete(StorageKeys.REFRESH_TOKEN);
          return Promise.reject(error);
        }
        originalRequest._retry = true;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return instance.request(originalRequest);
      } catch {
        refreshPromise = null;
        storage.delete(StorageKeys.ACCESS_TOKEN);
        storage.delete(StorageKeys.REFRESH_TOKEN);
        return Promise.reject(error);
      }
    },
  );
};

// Instances
const api = createAxiosInstance('application/json');
const apiFormData = createAxiosInstance('multipart/form-data');
attachResponseInterceptors(api);
attachResponseInterceptors(apiFormData);

// Utility: handle errors uniformly
const handleError = (error: unknown): ApiResponse => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    return {
      data: axiosError.response?.data ?? null,
      status: axiosError.response?.status ?? 500,
      success: false,
      error: axiosError.message,
    };
  }

  console.error('Unexpected Error:', error);
  return { data: null, status: 500, success: false, error: 'Unknown error' };
};

// handling error response
export const handleErrorResponse = (res: any) => {
  const error: any = new Error(res.error || 'Request failed');
  error.response = {
    data: res.data || { message: res.error || 'Something went wrong' },
    status: res.status,
  };
  error.data = res.data;
  error.status = res.status;
  error.success = res.success;
  throw error.data;
};

// ==========================
// API Methods
// ==========================

export const fetchData = async <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.get(endpoint, config);
    return { data: response.data, status: response.status, success: true };
  } catch (error) {
    return handleError(error);
  }
};

export const postData = async <T = any>(endpoint: string, body: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  console.log('This is api endpoint ===>', endpoint);
  try {
    const response: AxiosResponse<T> = await api.post(endpoint, body, config);
    return { data: response.data, status: response.status, success: true };
  } catch (error) {
    return handleError(error);
  }
};

export const postFormData = async <T = any>(endpoint: string, body: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiFormData.post(endpoint, body, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return { data: response.data, status: response.status, success: true };
  } catch (error) {
    return handleError(error);
  }
};

export const patchData = async <T = any>(endpoint: string, body: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.patch(endpoint, body, config);
    return { data: response.data, status: response.status, success: true };
  } catch (error) {
    return handleError(error);
  }
};

export const patchFormData = async <T = any>(endpoint: string, body: FormData, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await apiFormData.patch(endpoint, body, config);
    return { data: response.data, status: response.status, success: true };
  } catch (error) {
    return handleError(error);
  }
};

export const deleteData = async <T = any>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api.delete(endpoint, config);
    return { data: response.data, status: response.status, success: true };
  } catch (error) {
    return handleError(error);
  }
};

export default api;
