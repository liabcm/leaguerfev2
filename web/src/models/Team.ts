import { EventResult } from './EventResult';
import { TeamUser } from './TeamUser';

export interface Team {
  id: string;
  name: string;
  leagueId: string;
  rank: number;
  wins: number;
  losses: number;
  teamUsers: TeamUser[];
  teamManagers: TeamUser[];
  isPending: boolean;
  eventResults: EventResult[];
  events: Event[];
}
