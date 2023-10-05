import { DbStatus, Game, ViewGame } from './models';

type GameResponse = {
  created_time: string;
  db_status: string;
  id: string;
  modified_time: string;
  name: string | null;
  team1_name: string;
  team1_score: number;
  team2_name: string;
  team2_score: number;
  admin_id: string;
  view_id: string;
};

type ViewGameResponse = {
  created_time: string;
  db_status: string;
  modified_time: string;
  name: string | null;
  team1_name: string;
  team1_score: number;
  team2_name: string;
  team2_score: number;
  view_id: string;
};

function gameFromResponse(response: GameResponse): Game {
  return new Game(
    new Date(response.created_time),
    new Date(response.modified_time),
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
    new Date(response.created_time),
    new Date(response.modified_time),
    response.db_status as DbStatus,
    response.name,
    response.team1_name,
    response.team1_score,
    response.team2_name,
    response.team2_score,
    response.view_id
  );
}

/**
 * Calculates the number of milliseconds to wait until the next refetch from
 * the API.
 *
 * @param previousGame
 * @param game
 * @returns an integer between 1000-10000, depending on how frequently API
 * data is changing.
 */
function getRefetchInterval(
  previousGame: Game | null,
  game: Game | null
) {
  if (!previousGame || !game) {
    return 1000;
  }
  const millis = game.modifiedTime.getTime() - previousGame.modifiedTime.getTime();

  if (millis < 1000) {
    return 1000;
  }
  if (millis > 10000) {
    return 10000;
  }
  return millis;
}

export {
  type GameResponse,
  type ViewGameResponse,
  gameFromResponse,
  getRefetchInterval,
  viewGameFromResponse
}
