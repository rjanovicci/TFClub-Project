import Clubs from '../database/models/ClubModel';

export interface IClub {
  id: number,
  clubName: string,
}

const findAllClubs = async () => {
  const allClubs = await Clubs.findAll() as IClub[];

  return allClubs;
};

const findClubById = async (searchId: number) => {
  const foundClub = await Clubs.findOne({ where: { id: searchId } }) as IClub;

  return foundClub;
};

export {
  findAllClubs,
  findClubById,
};
