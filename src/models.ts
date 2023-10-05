enum DbStatus {
  Active = "active",
  Deleted = "deleted"
}

class Game {
  createdTime: Date;
  modifiedTime: Date;
  dbStatus: DbStatus;
  id: string;
  name: string | null;
  team1Name: string;
  team1Score: number;
  team2Name: string;
  team2Score: number;
  adminId: string;
  viewId: string;

  constructor(
    createdTime: Date,
    modifiedTime: Date,
    dbStatus: DbStatus,
    id: string,
    name: string | null,
    team1Name: string,
    team1Score: number,
    team2Name: string,
    team2Score: number,
    adminId: string,
    viewId: string
  ) {
    this.createdTime = createdTime;
    this.modifiedTime = modifiedTime;
    this.dbStatus = dbStatus;
    this.id = id;
    this.name = name;
    this.team1Name = team1Name;
    this.team1Score = team1Score;
    this.team2Name = team2Name;
    this.team2Score = team2Score;
    this.adminId = adminId;
    this.viewId = viewId;
  }
}

class ViewGame {
  createdTime: Date;
  modifiedTime: Date;
  dbStatus: DbStatus;
  name: string | null;
  team1Name: string;
  team1Score: number;
  team2Name: string;
  team2Score: number;
  viewId: string;

  constructor(
    createdTime: Date,
    modifiedTime: Date,
    dbStatus: DbStatus,
    name: string | null,
    team1Name: string,
    team1Score: number,
    team2Name: string,
    team2Score: number,
    viewId: string
  ) {
    this.createdTime = createdTime;
    this.modifiedTime = modifiedTime;
    this.dbStatus = dbStatus;
    this.name = name;
    this.team1Name = team1Name;
    this.team1Score = team1Score;
    this.team2Name = team2Name;
    this.team2Score = team2Score;
    this.viewId = viewId;
  }
}

export {
  DbStatus,
  Game,
  ViewGame
}
