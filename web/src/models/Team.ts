import { EventResult } from './EventResult';
import { EventTeam } from './EventTeam';
import { TeamLeague } from './TeamLeague';
import { TeamUser } from './TeamUser';

export interface Team {
  id: string;
  name: string;
  rank: number;
  wins: number;
  losses: number;
  teamUsers: TeamUser[];
  teamInvites: TeamUser[];
  teamRequests: TeamUser[];
  teamCreateRequests: TeamUser[];
  isPending: boolean;
  eventResults: EventResult[];
  eventTeams: EventTeam[];
  teamLeagues: TeamLeague[];
}
