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

const getTotalVictoriesH = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.homeClub.clubName === searchedTeam && each.homeTeamGoals > each.awayTeamGoals) {
      result += 1;
    }
  });
  return result;
};

const getTotalDrawsH = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.homeClub.clubName === searchedTeam && each.homeTeamGoals === each.awayTeamGoals) {
      result += 1;
    }
  });
  return result;
};

const getTotalLossH = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.homeClub.clubName === searchedTeam && each.homeTeamGoals < each.awayTeamGoals) {
      result += 1;
    }
  });
  return result;
};

const getGoalsFavorH = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.homeClub.clubName === searchedTeam) {
      result += each.homeTeamGoals;
    }
  });
  return result;
};

const getGoalsOwnH = (arrayMatchs: [], searchedTeam: string) => {
  const thisTeamResult = thisTeam(arrayMatchs, searchedTeam);
  let result = 0;
  thisTeamResult.forEach((each: IMatchs) => {
    if (each.homeClub.clubName === searchedTeam) {
      result += each.awayTeamGoals;
    }
  });
  return result;
};

const receiveDataH = (arrayMatchs: [], clubName: string) => {
  const totalVictories = getTotalVictoriesH(arrayMatchs, clubName);
  const totalDraws = getTotalDrawsH(arrayMatchs, clubName);
  const totalLosses = getTotalLossH(arrayMatchs, clubName);

  return { totalVictories, totalDraws, totalLosses };
};

const getLeaderboardHome = async (arrayClubs: IClub[], arrayMatchs: []) => {
  const leaderBoard: ILeaderboard[] = [];
  arrayClubs.forEach((eachObject) => {
    const data = receiveDataH(arrayMatchs, eachObject.clubName);
    const gF = getGoalsFavorH(arrayMatchs, eachObject.clubName);
    const gO = getGoalsOwnH(arrayMatchs, eachObject.clubName);
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

export default getLeaderboardHome;
