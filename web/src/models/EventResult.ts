import { Event } from './Event';
import { Team } from './Team';
import { User } from './User';

export interface EventResult {
  id: string;
  eventId: string;
  winningTeamId?: string;
  winningTeam?: Team;
  winningUserId?: string;
  winningUser?: User;
  losingTeamId?: string;
  losingTeam?: Team;
  losingUserId?: string;
  losingUser?: User;
  score: string;
  starPlayerUserId?: string;
  event: Event;
  starPlayer?: User;
}
