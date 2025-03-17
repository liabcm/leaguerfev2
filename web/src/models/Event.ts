import { EventResult } from './EventResult';
import { EventTeam } from './EventTeam';
import { EventUser } from './EventUser';
import { User } from './User';

export interface Event {
  id: string;
  location: string;
  leagueId: string;
  eventTime: string;
  createdBy: string;
  users?: EventUser[];
  teams?: EventTeam[];
  eventResult?: EventResult;
  opponentIds?: string[] | null;
  teamPlayers?: User[];
}
