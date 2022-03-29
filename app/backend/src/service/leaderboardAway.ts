import { IClub } from './clubs';

import { IDataPoints, ILeaderboard, IMatchs } from './interfaces/Iservice';

const thisTeam = (arrayMatchs: [], searchedTeam: string) => (arrayMatchs.filter((each: IMatchs) =>
  each.homeClub.clubName === searchedTeam || each.awayClub.clubName === searchedTeam));

const getEfficiency = (data: IDataPoints) => {
  const { totalVictories, totalDraws, totalLosses } = data;
  const totalPoints = (totalVictories * 3) + totalDraws;
  const totalGames = totalVictories + totalDraws + totalLosses;
  const result = Number(((totalPoints / (totalGames * 3)) * 100).toFixed(2));

  return result;
};

const getTotalVictoriesA = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.awayClub.clubName === searchedTeam && each.homeTeamGoals < each.awayTeamGoals) {
      result += 1;
    }
  });
  return result;
};

const getTotalDrawsA = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.awayClub.clubName === searchedTeam && each.homeTeamGoals === each.awayTeamGoals) {
      result += 1;
    }
  });
  return result;
};

const getTotalLossA = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.awayClub.clubName === searchedTeam && each.homeTeamGoals > each.awayTeamGoals) {
      result += 1;
    }
  });
  return result;
};

const getGoalsFavorA = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.awayClub.clubName === searchedTeam) {
      result += each.awayTeamGoals;
    }
  });
  return result;
};

const getGoalsOwnA = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.awayClub.clubName === searchedTeam) {
      result += each.homeTeamGoals;
    }
  });
  return result;
};

const receiveDataA = (arrayMatchs: [], clubName: string) => {
  const totalVictories = getTotalVictoriesA(arrayMatchs, clubName);
  const totalDraws = getTotalDrawsA(arrayMatchs, clubName);
  const totalLosses = getTotalLossA(arrayMatchs, clubName);

  return { totalVictories, totalDraws, totalLosses };
};

const getLeaderboardAway = async (arrayClubs: IClub[], arrayMatchs: []) => {
  const leaderBoard: ILeaderboard[] = [];
  arrayClubs.forEach((eachObject) => {
    const data = receiveDataA(arrayMatchs, eachObject.clubName);
    const gF = getGoalsFavorA(arrayMatchs, eachObject.clubName);
    const gO = getGoalsOwnA(arrayMatchs, eachObject.clubName);
    leaderBoard.push({ name: eachObject.clubName,
      totalPoints: (data.totalVictories * 3) + data.totalDraws,
      totalGames: data.totalVictories + data.totalLosses + data.totalDraws,
      totalVictories: data.totalVictories,
      totalDraws: data.totalDraws,
      totalLosses: data.totalLosses,
      goalsFavor: gF,
      goalsOwn: gO,
      goalsBalance: gF - gO,
      efficiency: getEfficiency(data),
    });
  });
  return leaderBoard;
};

export default getLeaderboardAway;
