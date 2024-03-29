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

class UpdateGameBody {
  name?: string;
  team1_name?: string;
  team1_score?: number;
  team2_name?: string;
  team2_score?: number;
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
 * @param currentInterval the current fetch interval
 * @param minInterval minimum new interval
 * @param maxInterval maximum new interval
 * @param previousModifiedTime
 * @param modifiedTime
 * @returns an integer between minInterval and maxInterval, depending on how frequently API
 * data is changing.
 */
function getRefetchInterval(
  currentInterval: number,
  minInterval: number,
  maxInterval: number,
  previousModifiedTime: Date | undefined,
  modifiedTime: Date | undefined
) {
  if (!previousModifiedTime || !modifiedTime) {
    return currentInterval;
  }

  let newInterval: number;
  if (modifiedTime.getTime() === previousModifiedTime.getTime()) {
    // No change.
    newInterval = currentInterval * 2;
  } else {
    // Data was updated.
    newInterval = minInterval;
  }

  if (newInterval < minInterval) {
    return minInterval;
  }
  if (newInterval > maxInterval) {
    return maxInterval;
  }
  return newInterval;
}

class HttpError {
  statusCode: number;
  errorMessage: string;

  constructor(statusCode: number, errorMessage: string) {
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;
  }
}

export {
  type GameResponse,
  HttpError,
  type ViewGameResponse,
  UpdateGameBody,
  gameFromResponse,
  getRefetchInterval,
  viewGameFromResponse
}
