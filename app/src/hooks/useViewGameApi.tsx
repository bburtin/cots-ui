import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

import { ViewGame } from '../models';
import { getRefetchInterval, ViewGameResponse, viewGameFromResponse } from '../api';

async function getGameByViewId(viewId: string): Promise<ViewGame> {
  const url = `/api/v1/games/view_id/${viewId}`;
  const response = await axios.get<ViewGameResponse>(url);
  return viewGameFromResponse(response.data);
}

export default function useViewGame(viewId: string) {
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
    const newInterval = getRefetchInterval(
      refetchInterval,
      1000,
      16000,
      previousGame?.modifiedTime,
      game?.modifiedTime
    );

    // console.log(`Fetched game ${game.viewId}, refetchInterval=${newInterval}`);

    setRefetchInterval(newInterval);
    updatePreviousGame(game);
    return game;
  }

  const query = useQuery({
    queryKey: ['games', 'viewId', viewId],
    queryFn: fetchGame,
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    throwOnError: true
  });

  return {
    viewGame: query.data,
    dataUpdatedAt
  }
}
