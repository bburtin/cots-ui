import {
  gameFromResponse,
  getRefetchInterval,
  GameResponse,
  viewGameFromResponse,
  ViewGameResponse
} from './api';

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
  let interval = getRefetchInterval(2000, 1000, 10000, undefined, undefined);
  expect(interval).toEqual(2000);

  interval = getRefetchInterval(2000, 1000, 10000, new Date(), undefined);
  expect(interval).toEqual(2000);

  interval = getRefetchInterval(2000, 1000, 10000, undefined, new Date());
  expect(interval).toEqual(2000);
});

test('calculates refetch interval object changed', () => {
  const date2 = new Date();
  const date1 = new Date(date2.getTime() - 3000);

  const interval = getRefetchInterval(3000, 1000, 10000, date1, date2);
  expect(interval).toEqual(1000);
});

test("calculates refetch interval when object hasn't changed", () => {
  const date1 = new Date();
  const date2 = new Date(date1.getTime());
  const interval = getRefetchInterval(2000, 1000, 10000, date1, date2);
  expect(interval).toEqual(4000);
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
