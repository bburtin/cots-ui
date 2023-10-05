import { Game, DbStatus } from './models';
import {
  gameFromResponse,
  getRefetchInterval,
  GameResponse,
  viewGameFromResponse,
  ViewGameResponse
} from './api';

function createGame(): Game {
  return new Game(
    new Date(),
    new Date(),
    DbStatus.Active,
    '123',
    'Volleyball',
    'MVHS',
    0,
    'LAHS',
    0,
    '456',
    '789'
  );
}

function createGameResponse(): GameResponse {
  return {
    "admin_id": "VRXL",
    "created_time": "2023-09-30T21:27:03.753578+00:00",
    "db_status": "active",
    "id": "2b60195bdc7d4be48f505fe53737c6e3",
    "modified_time": "2023-09-30T21:27:04.753578+00:00",
    "name": null,
    "team1_name": "a",
    "team1_score": 0,
    "team2_name": "b",
    "team2_score": 0,
    "view_id": "FGNW"
  };
}

function createViewGameResponse(): ViewGameResponse {
  return {
    "created_time": "2023-09-30T21:27:03.753578+00:00",
    "db_status": "active",
    "modified_time": "2023-09-30T21:27:04.753578+00:00",
    "name": null,
    "team1_name": "a",
    "team1_score": 0,
    "team2_name": "b",
    "team2_score": 0,
    "view_id": "FGNW"
  };
}

test('calculates refetch interval with null Games', () => {
  let interval = getRefetchInterval(null, null);
  expect(interval).toEqual(1000);

  interval = getRefetchInterval(createGame(), null);
  expect(interval).toEqual(1000);

  interval = getRefetchInterval(null, createGame());
  expect(interval).toEqual(1000);
});

test('calculates refetch interval in range', () => {
  const game1 = createGame();
  const game2 = createGame();
  game2.modifiedTime = new Date(game1.modifiedTime.getTime() + 3000);

  const interval = getRefetchInterval(game1, game2);
  expect(interval).toEqual(3000);
});

test('calculates refetch interval short', () => {
  const game1 = createGame();
  const game2 = createGame();
  game2.modifiedTime = new Date(game1.modifiedTime.getTime() + 500);

  const interval = getRefetchInterval(game1, game2);
  expect(interval).toEqual(1000);
});

test('calculates refetch interval long', () => {
  const game1 = createGame();
  const game2 = createGame();
  game2.modifiedTime = new Date(game1.modifiedTime.getTime() + 11000);

  const interval = getRefetchInterval(game1, game2);
  expect(interval).toEqual(10000);
});

test('converts an API response to a Game object', () => {
  const response = createGameResponse();
  const game = gameFromResponse(response);

  expect(game.createdTime).toEqual(new Date(response.created_time));
  expect(game.modifiedTime).toEqual(new Date(response.modified_time));
  expect(game.id).toEqual(response.id);
  expect(game.name).toBeNull();
});

test('converts an API response to a ViewGame object', () => {
  const response = createViewGameResponse();
  const viewGame = viewGameFromResponse(response);

  expect(viewGame.createdTime).toEqual(new Date(response.created_time));
  expect(viewGame.modifiedTime).toEqual(new Date(response.modified_time));
  expect(viewGame.name).toBeNull();
});
