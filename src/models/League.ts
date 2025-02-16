import { Team } from './Team';
import { User } from './User';
import { Event } from './Event';

export interface League {
  id: string;
  name: string;
  sport: string;
  isCompetitive: boolean;
  isPublic: boolean;
  leagueUsers: User[];
  isTeamLeague: boolean;
  teams: Team[];
  events: Event[];
}
