export interface ILeaderboard {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number;
}

export interface IMatchs {
  id: number,
  homeTeamGoals: number,
  awayTeamGoals: number,
  homeClub: {
    clubName: string
  },
  awayClub: {
    clubName: string
  }
}

export interface IDataPoints {
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
}
