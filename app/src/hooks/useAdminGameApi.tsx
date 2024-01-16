import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

import { Game } from '../models';
import {
  GameResponse,
  gameFromResponse,
  getRefetchInterval,
  UpdateGameBody
} from '../api';

async function getGameById(id: string): Promise<Game> {
  const url = `/api/v1/games/${id}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

async function updateGameById(id: string, body: UpdateGameBody): Promise<Game> {
  const url = `/api/v1/games/${id}`;
  const response = await axios.patch<GameResponse>(url, body);
  return gameFromResponse(response.data);
}

export default function useAdminGameApi(gameId: string) {
  const [previousGame, setPreviousGame] = useState<Game | null>(null);
  const [refetchInterval, setRefetchInterval] = useState(1000);
  const queryClient = useQueryClient();

  const state = queryClient.getQueryState(['games', gameId]);
  const dataUpdatedAt = state ? new Date(state.dataUpdatedAt) : null;

  /**
   * If API data has changed, remember the latest version.  This allows
   * us to set the refetch interval.
   * @param game the latest Game object from the API
   */
  function updatePreviousGame(game: Game) {
    if (!previousGame || game.modifiedTime.getTime() !== previousGame.modifiedTime.getTime()) {
      setPreviousGame(game);
    }
  }

  async function fetchGame(): Promise<Game> {
    const game = await getGameById(gameId);
    const newInterval = getRefetchInterval(
      refetchInterval,
      1000,
      16000,
      previousGame?.modifiedTime,
      game?.modifiedTime
    );

    // console.log(`Fetched game ${game.id}, refetchInterval=${newInterval}`);

    setRefetchInterval(newInterval);
    updatePreviousGame(game);

    return game;
  }

  const query = useQuery({
    queryKey: ['games', gameId],
    queryFn: fetchGame,
    staleTime: refetchInterval,
    refetchInterval: refetchInterval,
    throwOnError: true
  });

  const mutation = useMutation(
    {
      mutationFn: (body: UpdateGameBody) => updateGameById(gameId, body),
      onSuccess: (game, variables, context) => {
        const key = ['games', game.id];
        queryClient.invalidateQueries({ queryKey: key });
        queryClient.setQueryData(key, game);
        updatePreviousGame(game);
        console.log(`Mutated Game ${gameId}, setting refetchInterval to 1000`);
        setRefetchInterval(1000);
      },
      throwOnError: true
    }
  );

  function mutate(body: UpdateGameBody) {
    mutation.mutate(body);
  }

  return {
    game: query.data,
    dataUpdatedAt,
    mutate
  }
}