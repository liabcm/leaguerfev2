import { TeamUserStatus } from './TeamUserStatusEnum';

export interface TeamUser {
  userId: string;
  teamId: string;
  teamName: string;
  name: string;
  email: string;
  isManager: boolean;
  status: TeamUserStatus;
}
