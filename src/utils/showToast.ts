import { Toast } from 'toastify-react-native';

type ToastType = 'success' | 'error' | 'info' | 'warn' | 'default';

export const showToast = (
    type: ToastType,
    message: string,
    subMessage: string = '',
    duration: number = 3000
) => {
    Toast.show({
        type,
        text1: message,
        text2: subMessage,
        position: 'top',
        visibilityTime: duration,
        autoHide: true,
    });
};
