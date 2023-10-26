import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools  } from '@tanstack/react-query-devtools';

import { CssVarsProvider } from '@mui/joy/styles';

import { useParams } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import ErrorBoundaryFallback from './ErrorBoundaryFallback';
import { ViewGame } from './models';
import { getRefetchInterval, ViewGameResponse, viewGameFromResponse } from './api';

async function getGameByViewId(viewId: string): Promise<ViewGame> {
  const url = `/api/v1/games/view_id/${viewId}`;
  const response = await axios.get<ViewGameResponse>(url);
  return viewGameFromResponse(response.data);
}

interface Props {
  viewId: string;
}

/**
 * Wraps the API to get Game data.  This allows ViewGame to render HTTP erors
 * with an error boundry.
 */
const ApiWrapper: React.FC<Props> = ({ viewId }: Props) => {
  const [refetchInterval, setRefetchInterval] = useState(1000);
  const [previousGame, setPreviousGame] = useState<ViewGame | undefined>();
  const queryClient = useQueryClient();

  const state = queryClient.getQueryState(['games', 'viewId', viewId]);
  const dataUpdatedAt = state ? new Date(state.dataUpdatedAt) : undefined;

  /**
   * If API data has changed, remember the latest version.  This allows
   * us to set the refetch interval.
   * @param game the latest Game object from the API
   */
  function updatePreviousGame(game: ViewGame) {
    if (!previousGame || game.modifiedTime.getTime() !== previousGame.modifiedTime.getTime()) {
      setPreviousGame(game);
    }
  }

  async function fetchGame(): Promise<ViewGame> {
    const game = await getGameByViewId(viewId);
    updatePreviousGame(game);
    const newInterval = getRefetchInterval(
      refetchInterval,
      1000,
      16000,
      previousGame?.modifiedTime,
      game?.modifiedTime
    );
    setRefetchInterval(newInterval);
    // console.log(`Fetched game ${game.id}, refetchInterval=${newInterval}`);
    return game;
  }

  const query = useQuery({
    queryKey: ['games', 'viewId', viewId],
    queryFn: fetchGame,
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    useErrorBoundary: true
  });

  const game = query.data;

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
      {dataUpdatedAt && <p>Data updated at {dataUpdatedAt.toLocaleTimeString()}.</p>}
    </>
  );
}

function ViewGameComponent() {
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

export default ViewGameComponent;
