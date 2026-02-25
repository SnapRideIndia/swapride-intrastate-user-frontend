import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
} from 'axios';
import { storage } from '../utils/store';
import { StorageKeys } from '../constants/storage/storageKeys';

// Base configuration
const BASE_URL = 'http://swapride-intrastate-staging.eba-hgachq5q.ap-south-2.elasticbeanstalk.com/';
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
            console.log("this is access token inside the apiutility file ===>", token)
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );

    return instance;
};

// Instances
const api = createAxiosInstance('application/json');
const apiFormData = createAxiosInstance('multipart/form-data');

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
            status: res.status
        };
        error.data = res.data;
        error.status = res.status;
        error.success = res.success;
        throw error.data;
    }


// ==========================
// API Methods
// ==========================

export const fetchData = async <T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response: AxiosResponse<T> = await api.get(endpoint, config);
        return { data: response.data, status: response.status, success: true };
    } catch (error) {
        return handleError(error);
    }
};

export const postData = async <T = any>(
    endpoint: string,
    body: unknown,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    console.log("This is api endpoint ===>", endpoint)
    try {
        const response: AxiosResponse<T> = await api.post(endpoint, body, config);
        return { data: response.data, status: response.status, success: true };
    } catch (error) {
        return handleError(error);
    }
};

export const postFormData = async <T = any>(
    endpoint: string,
    body: FormData,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
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

export const patchFormData = async <T = any>(
    endpoint: string,
    body: FormData,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response: AxiosResponse<T> = await apiFormData.patch(endpoint, body, config);
        return { data: response.data, status: response.status, success: true };
    } catch (error) {
        return handleError(error);
    }
};

export const deleteData = async <T = any>(
    endpoint: string,
    config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
    try {
        const response: AxiosResponse<T> = await api.delete(endpoint, config);
        return { data: response.data, status: response.status, success: true };
    } catch (error) {
        return handleError(error);
    }
};

export default api;
