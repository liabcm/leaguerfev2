import { EventResult } from './EventResult';
import { EventTeam } from './EventTeam';
import { EventUser } from './EventUser';
import { User } from './User';

export interface Event {
  id: string;
  location: string;
  leagueId?: string;
  eventTime: string;
  createdBy: string;
  users?: EventUser[];
  teams?: EventTeam[];
  eventResult?: EventResult;
  opponentIds?: string[] | null;
  teamPlayers?: User[];
  maxParticipants: number;
  isTeamEvent: boolean;
  eventType: EventType;
  joinType: EventJoinType;
  sport: string;
  memberInvites: EventUser[];
  memberRequests: EventUser[];
  teamInvites: EventTeam[];
  teamRequests: EventTeam[];
}

export enum EventType {
  Single = 0,
  MultiRound = 1,
  FreePlay = 2,
  Tournament = 3,
}

export enum EventJoinType {
  AddOnly = 0,
  InviteOnly = 1,
  Request = 2,
  Open = 3,
}
