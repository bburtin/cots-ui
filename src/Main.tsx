import { useState } from 'react';
import {
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

import { CssVarsProvider } from '@mui/joy/styles';

import { GameResponse, gameFromResponse } from './api';
import GameForm from './GameForm';

function Main() {
  const [isRunning, setIsRunning] = useState(false);

  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['gameData'],
    queryFn: () =>
      axios
        .get<GameResponse>('/api/v1/games/fe17381295b743c7b54983889544fc8e')
        .then((res) => res.data),
  });

  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  let game = null;
  if (data) {
    game = gameFromResponse(data);
  }

  return (
    <CssVarsProvider>

      {isLoading && <p>Loading...</p>}
      {error != null && <p><b>Error: {errorMessage}</b></p>}
      {isFetching && <p>Fetching...</p>}

      {game && <GameForm game={game} />}
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default Main;
