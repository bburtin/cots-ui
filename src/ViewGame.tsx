import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { CssVarsProvider } from '@mui/joy/styles';

import { useParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';

async function getGameByViewId(viewId: string | undefined): Promise<Game> {
  const url = `/api/v1/games/view_id/${viewId}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

function ViewGame() {
  const { viewId } = useParams();
  const query = useQuery({
    queryKey: ['games', 'viewId', viewId],
    queryFn: () => getGameByViewId(viewId),
    staleTime: 5000,
    refetchInterval: 5000
  });

  let game: Game | null = null;
  if (query.data) {
    game = query.data;
}

  return (
    <CssVarsProvider>
      {game && (
        <>
          <h1>{game.name}</h1>
          <p><b>{game.team1Name}:</b> {game.team1Score}</p>
          <p><b>{game.team2Name}:</b> {game.team2Score}</p>
        </>
      )}
      {!game && <h1>Loading...</h1>}
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default ViewGame;
