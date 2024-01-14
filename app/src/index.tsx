import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

// import './index.css';
import Admin from './Admin';
import Main from './Main';
import ViewGameComponent from './ViewGameComponent';

// import 'bootstrap/dist/css/bootstrap.min.css'
import './custom-theme.scss';

const queryClient = new QueryClient()

interface AppProps {
  queryClient: QueryClient
}

const App: React.FC<AppProps> = ({ queryClient }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/admin/:adminId" element={<Admin />} />
          <Route path="/view/:viewId" element={<ViewGameComponent />} />
        </Routes>
      </BrowserRouter>
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
