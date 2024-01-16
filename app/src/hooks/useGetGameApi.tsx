import {
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import axios from 'axios';

import { GameResponse, gameFromResponse } from '../api';
import { Game } from '../models';

async function getGameByAdminId(adminId: string | undefined): Promise<Game> {
  const url = `/api/v1/games/admin_id/${adminId}`;
  const response = await axios.get<GameResponse>(url);
  return gameFromResponse(response.data);
}

export default function useGetGameByAdminIdApi(adminId: string) {
  const query = useQuery({
    queryKey: ['games', 'adminId', adminId],
    queryFn: () => getGameByAdminId(adminId),
    throwOnError: true
  });
  const queryClient = useQueryClient();

  let game: Game | null = null;
  if (query.data) {
    game = query.data;
    const key = ['games', game.id];
    queryClient.invalidateQueries({ queryKey: key });
    queryClient.setQueryData(key, game);
  }

  return {
    game: query.data
  }
}
