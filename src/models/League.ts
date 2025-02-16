import { Team } from './Team';
import { User } from './User';

export interface League {
  id: string;
  name: string;
  sport: string;
  isCompetitive: boolean;
  isPublic: boolean;
  leagueUsers: User[];
  isTeamLeague: boolean;
  teams: Team[];
}
