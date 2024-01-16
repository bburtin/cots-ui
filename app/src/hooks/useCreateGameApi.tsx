import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

import { Game } from '../models';
import { GameResponse, gameFromResponse } from '../api';

class CreateGameBody {
  name?: string;
  team1_name: string;
  team2_name: string;

  constructor(team1Name: string, team2Name: string) {
    this.team1_name = team1Name;
    this.team2_name = team2Name;
  }
};

async function createGame(body: CreateGameBody): Promise<Game> {
  console.log(`Creating a game: ${JSON.stringify(body)}`);
  const response = await axios.post<GameResponse>('/api/v1/games', body);
  console.log(`Received status ${response.status}, ${JSON.stringify(response.data)}`)
  return gameFromResponse(response.data);
}

export default function useCreateGameApi(onCreateCallback?: (game: Game) => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    {
      mutationFn: (body: CreateGameBody) => createGame(body),
      onSuccess: (game, variables, context) => {
        const key = ['games', game.id];
        queryClient.setQueryData(key, game);
        if (onCreateCallback) {
          onCreateCallback(game);
        }
      },
      throwOnError: true
    }
  );

  function create(team1Name: string, team2Name: string, name?: string) {
    const body = new CreateGameBody(team1Name, team2Name);
    if (name) {
      body.name = name;
    }
    mutation.mutate(body);
  }

  return {
    create
  }
}
