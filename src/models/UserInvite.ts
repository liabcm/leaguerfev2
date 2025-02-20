import { League } from './League';
import { User } from './User';

export interface UserInvite {
  leagueId: string;
  userId: string;
  isDeleted: boolean;
  league: League; // Assuming you have a League interface
  user: User; // Assuming you have a User interface
}
