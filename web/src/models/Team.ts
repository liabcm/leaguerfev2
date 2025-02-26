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
}
