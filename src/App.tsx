import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import Main from './Main';

interface Props {
  queryClient: QueryClient
}

const App: React.FC<Props> = ({ queryClient }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  )
}

export default App;
