import { Event } from './Event';
import { LeagueUser } from './LeagueUser';
import { Team } from './Team';

export interface League {
  id: string;
  name: string;
  sport: string;
  isCompetitive: boolean;
  isPublic: boolean;
  leagueUsers: LeagueUser[];
  isTeamLeague: boolean;
  teams: Team[];
  events: Event[];
}
