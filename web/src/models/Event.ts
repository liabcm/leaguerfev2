import { EventResult } from './EventResult';
import { Team } from './Team';
import { User } from './User';

export interface Event {
  id: string;
  location: string;
  leagueId: string;
  eventTime: string;
  createdBy: string;
  users: User[];
  teams: Team[];
  eventResult?: EventResult;
  opponentIds?: string[] | null;
}
