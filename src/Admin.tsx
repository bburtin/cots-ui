import React, { useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { CssVarsProvider } from '@mui/joy/styles';

import { useParams } from 'react-router-dom';

import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

import GameForm from './GameForm';
import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';

async function getGameByAdminId(adminId: string | undefined): Promise<Game> {
  const url = `/api/v1/games/admin_id/${adminId}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

function Admin() {
  const { adminId } = useParams();
  const query = useQuery({
    queryFn: () => getGameByAdminId(adminId)
  });
  const queryClient = useQueryClient();

  let game: Game | null = null;
  if (query.data) {
    game = query.data;
    const key = ['games', game.id];
    queryClient.invalidateQueries(key);
    queryClient.setQueryData(key, game);
}

  return (
    <CssVarsProvider>
      {game && <GameForm gameId={game.id} />}
      {!game && <h1>Loading...</h1>}
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default Admin;
