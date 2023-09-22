import { DbStatus, Game } from './models';

type GameResponse = {
  created_time: Date;
  db_status: string;
  id: string;
  modified_time: Date;
  name: string;
  team1_name: string;
  team1_score: number;
  team2_name: string;
  team2_score: number;
};

function gameFromResponse(response: GameResponse): Game {
  return new Game(
    response.created_time,
    response.db_status as DbStatus,
    response.id,
    response.name,
    response.team1_name,
    response.team1_score,
    response.team2_name,
    response.team2_score
  );
}

export {
  type GameResponse,
  gameFromResponse
}
