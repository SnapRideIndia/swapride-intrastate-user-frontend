import { useMutation } from "@tanstack/react-query";
import AuthService from "../services/AuthService";

export const useLogin = (
    onSuccess: (data: any) => void,
    onError: (error: any) => void
) => {
    return useMutation({
        mutationFn: AuthService.sendOTP,
        onSuccess,
        onError
    });
};


export const useVerifyOTP = (
    onSuccess: (data: any) => void,
    onError: (error: any) => void
) => {
    return useMutation({
        mutationFn: AuthService.verifyOTP,
        onSuccess,
        onError
    });
};

export const useRegisterUser = (
    onSuccess: (data: any) => void,
    onError: (error: any) => void
) => {
    return useMutation({
        mutationFn: AuthService.registerUser,
        onSuccess,
        onError
    });
};