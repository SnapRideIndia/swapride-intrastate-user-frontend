import { useMutation } from "@tanstack/react-query";
import AuthService from "../services/AuthService";
import { useDispatch } from "react-redux";
import { storage } from "../utils/store";
import { StorageKeys } from "../constants/storage/storageKeys";
import { setAccessToken, setRefreshToken } from "../slice/authSlice";

export const useLogin = (onSuccess: (data: any) => void, onError: (error: any) => void) => {
  return useMutation({
    mutationFn: AuthService.sendOTP,
    onSuccess,
    onError,
  });
};

export const useVerifyOTP = (onSuccess: (data: any) => void, onError: (error: any) => void) => {
  return useMutation({
    mutationFn: AuthService.verifyOTP,
    onSuccess,
    onError,
  });
};

export const useRegisterUser = (onSuccess: (data: any) => void, onError: (error: any) => void) => {
  return useMutation({
    mutationFn: AuthService.registerUser,
    onSuccess,
    onError,
  });
};

export const useLogout = (
    onSuccess: (data: any) => void,
    onError: (error: any) => void
) => {
    return useMutation({
        mutationFn: AuthService.logout,
        onSuccess,
        onError
    });
};

/**
 * Refresh access token (sliding session). Updates MMKV and Redux.
 * Call on app focus or when you need to extend the session before 1 hr expiry.
 */
export const useRefreshToken = (
    onSuccess?: (data: { accessToken: string; refreshToken?: string }) => void,
    onError?: (error: any) => void
) => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: async () => {
            const refreshToken = storage.getString(StorageKeys.REFRESH_TOKEN);
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            return AuthService.refreshAccessToken(refreshToken);
        },
        onSuccess: (data) => {
            dispatch(setAccessToken(data.accessToken));
            if (data.refreshToken) {
                dispatch(setRefreshToken(data.refreshToken));
            }
            onSuccess?.(data);
        },
        onError,
    });
};
