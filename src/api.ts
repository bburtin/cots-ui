import { DbStatus, Game, ViewGame } from './models';

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
  admin_id: string;
  view_id: string;
};

type ViewGameResponse = {
  created_time: Date;
  db_status: string;
  modified_time: Date;
  name: string;
  team1_name: string;
  team1_score: number;
  team2_name: string;
  team2_score: number;
  view_id: string;
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
    response.team2_score,
    response.admin_id,
    response.view_id
  );
}

function viewGameFromResponse(response: ViewGameResponse): ViewGame {
  return new ViewGame(
    response.created_time,
    response.db_status as DbStatus,
    response.name,
    response.team1_name,
    response.team1_score,
    response.team2_name,
    response.team2_score,
    response.view_id
  );
}

export {
  type GameResponse,
  type ViewGameResponse,
  gameFromResponse,
  viewGameFromResponse
}
