import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import AppWrapper from './components/common/AppWrapper/AppWrapper';
import { store } from './store';

const App = () => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient} >
      <Provider store={store}>
        <AppWrapper />
      </Provider>
    </QueryClientProvider>
  )
}

export default App;