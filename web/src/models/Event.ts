import { EventResult } from './EventResult';
import { EventTeam } from './EventTeam';
import { User } from './User';

export interface Event {
  id: string;
  location: string;
  leagueId: string;
  eventTime: string;
  createdBy: string;
  users?: User[];
  teams?: EventTeam[];
  eventResult?: EventResult;
  opponentIds?: string[] | null;
  teamPlayers?: User[];
}
