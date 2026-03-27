export type ToastType = 'success' | 'error' | 'info' | 'warn' | 'default';

export type ToastPosition = 'top' | 'bottom';

export type CustomToastPayload = {
  type?: ToastType;
  text1?: string;
  text2?: string;
  duration?: number;
  autoHide?: boolean;
  position?: ToastPosition;
};

type ToastListener = (payload: CustomToastPayload) => void;

let listener: ToastListener | null = null;

export const registerToastListener = (nextListener: ToastListener | null) => {
  listener = nextListener;
};

export const showCustomToast = (
  type: ToastType,
  message: string,
  subMessage: string = '',
  duration: number = 3000,
) => {
  listener?.({
    type,
    text1: message,
    text2: subMessage,
    duration,
    autoHide: true,
    position: 'bottom',
  });
};

export const customToast = {
  show: (payload: CustomToastPayload) => listener?.(payload),
};
