enum DbStatus {
  Active = "active",
  Deleted = "deleted"
}

class Game {
  createdTime: Date;
  dbStatus: DbStatus;
  id: string;
  name: string;
  team1Name: string;
  team1Score: number;
  team2Name: string;
  team2Score: number;

  constructor(
    createdTime: Date,
    dbStatus: DbStatus,
    id: string,
    name: string,
    team1Name: string,
    team1Score: number,
    team2Name: string,
    team2Score: number
  ) {
    this.createdTime = createdTime;
    this.dbStatus = dbStatus;
    this.id = id;
    this.name = name;
    this.team1Name = team1Name;
    this.team1Score = team1Score;
    this.team2Name = team2Name;
    this.team2Score = team2Score;
  }
}

export {
  DbStatus,
  Game
}
