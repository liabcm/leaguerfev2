import { League } from './League';
import { Team } from './Team';

export interface TeamLeague {
  leagueId: string;
  teamId: string;
  team: Team;
  league: League;
}
