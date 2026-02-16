import { useCallback } from 'react';
import { Alert } from 'react-native';

interface ErrorReportOptions {
    showAlert?: boolean;
    logToConsole?: boolean;
    customHandler?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const useErrorReporting = (options: ErrorReportOptions = {}) => {
    const {
        showAlert = false,
        logToConsole = true,
        customHandler,
    } = options;

    const reportError = useCallback((error: Error, errorInfo?: React.ErrorInfo) => {
        if (logToConsole) {
            console.error('Error reported:', error);
            if (errorInfo) {
                console.error('Error info:', errorInfo);
            }
        }

        if (customHandler) {
            customHandler(error, errorInfo || { componentStack: '' });
        }

        if (showAlert) {
            Alert.alert(
                'Error Occurred',
                error.message || 'An unexpected error occurred',
                [{ text: 'OK' }]
            );
        }
    }, [showAlert, logToConsole, customHandler]);

    return { reportError };
};
