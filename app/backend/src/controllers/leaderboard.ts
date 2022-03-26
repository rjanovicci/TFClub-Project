import * as express from 'express';
import { Request, Response } from 'express';
import { getLeaderboardHome, getLeaderboardAway, ILeaderboard } from '../service/leaderboard';
import { findAllClubs } from '../service/clubs';
import { findAllMatchs } from '../service/matchs';

const routerLeaderboard = express.Router();

const order = (a: ILeaderboard, b: ILeaderboard): number => {
  if (a.totalPoints > b.totalPoints) return -1;
  if (a.totalPoints < b.totalPoints) return 1;
  if (a.totalVictories > b.totalVictories) return -1;
  if (a.totalVictories < b.totalVictories) return 1;
  if (a.goalsBalance > b.goalsBalance) return -1;
  if (a.goalsBalance < b.goalsBalance) return 1;
  if (a.goalsFavor > b.goalsFavor) return -1;
  if (a.goalsFavor < b.goalsFavor) return 1;
  if (a.goalsOwn > b.goalsOwn) return -1;
  if (a.goalsOwn > b.goalsOwn) return -1;
  return 0;
};

routerLeaderboard.get(
  '/home',
  async (_req: Request, res: Response) => {
    const arrayClubs = await findAllClubs();
    const arrayMatchs = await findAllMatchs('false') as unknown as [];
    const result = await getLeaderboardHome(arrayClubs, arrayMatchs);
    result.sort(order);

    return res.status(200).json(result);
  },
);

routerLeaderboard.get(
  '/away',
  async (_req: Request, res: Response) => {
    const arrayClubs = await findAllClubs();
    const arrayMatchs = await findAllMatchs('false') as unknown as [];
    const result = await getLeaderboardAway(arrayClubs, arrayMatchs);
    result.sort(order);

    return res.status(200).json(result);
  },
);

export default routerLeaderboard;
