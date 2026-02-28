import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import AppNavigation from '../../../navigation/stack';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { useErrorReporting } from '../../../hooks/useErrorReporting';
import ThemeProvider from '../../../theme/ThemeProvider';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const AppWrapper = () => {
  const { reportError } = useErrorReporting({
    logToConsole: true,
    showAlert: false,
    customHandler: (error, errorInfo) => {
      // You can integrate with crash reporting services here
      // For example: Crashlytics, Sentry, etc.
      console.log(
        'Error reported to custom handler:',
        error.message,
        errorInfo.componentStack,
      );
    },
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <BottomSheetModalProvider>
          <ErrorBoundary onError={reportError}>
            <AppNavigation />
          </ErrorBoundary>
        </BottomSheetModalProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppWrapper;
