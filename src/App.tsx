import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import AppWrapper from './components/common/AppWrapper/AppWrapper';
import { store } from './store';
import { handleInitialNotification, initNotifications } from './utils/notificationUtility';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      try {
        unsubscribe = await initNotifications();
        const initialNotification = await handleInitialNotification();
        console.log("this is initial Notification ===>", initialNotification);
      } catch (error) {
        console.error('Error during notifications bootstrap:', error);
      }
    })();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppWrapper />
      </Provider>
    </QueryClientProvider>
  );
};

export default App;
