import { ILeaderboard } from './interfaces/Iservice';

const getEfficiencyAll = (home: ILeaderboard, away: ILeaderboard) => {
  const totalVictories = home.totalVictories + away.totalVictories;
  const totalDraws = home.totalDraws + away.totalDraws;
  const totalLosses = home.totalLosses + away.totalLosses;
  const totalPoints = (totalVictories * 3) + totalDraws;
  const totalGames = totalVictories + totalDraws + totalLosses;
  const result = Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));

  return result;
};

const getLeaderboard = async (
  arrayLeaderboardHome: ILeaderboard[],
  arrayLeaderboardAway: ILeaderboard[],
) => {
  const finalResult: ILeaderboard[] = [];
  arrayLeaderboardHome.forEach((e, i) => {
    if (e.name === arrayLeaderboardAway[i].name) {
      finalResult.push({ name: e.name,
        totalPoints: e.totalPoints + arrayLeaderboardAway[i].totalPoints,
        totalGames: e.totalGames + arrayLeaderboardAway[i].totalGames,
        totalVictories: e.totalVictories + arrayLeaderboardAway[i].totalVictories,
        totalDraws: e.totalDraws + arrayLeaderboardAway[i].totalDraws,
        totalLosses: e.totalLosses + arrayLeaderboardAway[i].totalLosses,
        goalsFavor: e.goalsFavor + arrayLeaderboardAway[i].goalsFavor,
        goalsOwn: e.goalsOwn + arrayLeaderboardAway[i].goalsOwn,
        goalsBalance: e.goalsBalance + arrayLeaderboardAway[i].goalsBalance,
        efficiency: getEfficiencyAll(e, arrayLeaderboardAway[i]) });
    }
  }); return finalResult;
};

export default getLeaderboard;
