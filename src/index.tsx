import React from 'react';
import ReactDOM from 'react-dom/client';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import './index.css';
import Main from './Main';

const queryClient = new QueryClient()

interface AppProps {
  queryClient: QueryClient
}

const App: React.FC<AppProps> = ({ queryClient }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Main gameId="b499bdb254fc4bcd925bb4c288ed80f8"/>
    </QueryClientProvider>
  )
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App queryClient={queryClient}/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
