import { EventResult } from './EventResult';
import { TeamUser } from './TeamUser';

export interface Team {
  id: string;
  name: string;
  leagueId: string;
  leagueName: string;
  rank: number;
  wins: number;
  losses: number;
  teamUsers: TeamUser[];
  teamManagers: TeamUser[];
  teamInvites: TeamUser[];
  teamRequests: TeamUser[];
  teamCreateRequests: TeamUser[];
  isPending: boolean;
  eventResults: EventResult[];
  eventTeams: EventTeam[];
}

export interface EventTeam {
  eventId: string;
  teamId: string;
  event: Event;
}
