import { User } from './User';

export interface Event {
  id: string;
  location: string;
  leagueId: string;
  eventTime: string;
  createdBy: string;
  users: User[];
  opponentIds?: string[] | null;
}
