import React, { useState } from 'react';
import {
  useQuery,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import axios from 'axios';

import { CssVarsProvider } from '@mui/joy/styles';

import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';
import GameForm from './GameForm';

interface Props {
  gameId: string;
}

async function getGameById(id: string): Promise<Game> {
  const url = `/api/v1/games/${id}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

const Main: React.FC<Props> = ({ gameId }: Props) => {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['games', gameId],
    queryFn: () => getGameById(gameId)
  });

  let errorMessage = '';
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <CssVarsProvider>

      {isLoading && <p>Loading...</p>}
      {error != null && <p><b>Error: {errorMessage}</b></p>}
      {isFetching && <p>Fetching...</p>}

      {data && <GameForm game={data} />}
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default Main;
