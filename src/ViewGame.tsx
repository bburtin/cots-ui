import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { CssVarsProvider } from '@mui/joy/styles';

import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';
import { Game } from './models';
import { GameResponse, gameFromResponse } from './api';

async function getGameByViewId(viewId: string | undefined): Promise<Game> {
  const url = `/api/v1/games/view_id/${viewId}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

interface Props {
  viewId: string;
}

/**
 * Wraps the API to get Game data.  This allows ViewGame to render HTTP erors
 * with an error boundry.
 */
const ApiWrapper: React.FC<Props> = ({ viewId }: Props) => {
  const query = useQuery({
    queryKey: ['games', 'viewId', viewId],
    queryFn: () => getGameByViewId(viewId),
    staleTime: 5000,
    refetchInterval: 5000,
    useErrorBoundary: true
  });

  let game: Game | null = null;
  if (query.data) {
    game = query.data;
  }

  return (
    <>
      {game && (
        <>
          <h1>{game.name}</h1>
          <p><b>{game.team1Name}:</b> {game.team1Score}</p>
          <p><b>{game.team2Name}:</b> {game.team2Score}</p>
        </>
      )}
      {!game && <h3>Loading game {viewId}...</h3>}
    </>
  );
}

function ViewGame() {
  const { viewId } = useParams();

  return (
    <CssVarsProvider>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback} >
        { viewId && <ApiWrapper viewId={viewId} /> }
      </ErrorBoundary>
      <ReactQueryDevtools initialIsOpen />
    </CssVarsProvider>
  );
}

export default ViewGame;
