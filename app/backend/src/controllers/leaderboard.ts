import * as express from 'express';
import { Request, Response } from 'express';
import getLeaderboardHome from '../service/leaderboardHome';
import getLeaderboardAway from '../service/leaderboardAway';
import order from '../service/leaderboardOrder';
import getLeaderboard from '../service/leaderboard';
import { findAllClubs } from '../service/clubs';
import { findAllMatchs } from '../service/matchs';

const routerLeaderboard = express.Router();

routerLeaderboard.get(
  '/',
  async (_req: Request, res: Response) => {
    const arrayClubs = await findAllClubs();
    const arrayMatchs = await findAllMatchs('false') as unknown as [];
    const resultHome = await getLeaderboardHome(arrayClubs, arrayMatchs);
    const resultAway = await getLeaderboardAway(arrayClubs, arrayMatchs);
    const result = await getLeaderboard(resultHome, resultAway);
    result.sort(order);

    return res.status(200).json(result);
  },
);

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
