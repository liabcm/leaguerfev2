export enum EventJoinType {
  AddOnly = 0,
  InviteOnly = 1,
  Request = 2,
  Open = 3,
}

export enum EventType {
  Single = 0,
  MultiRound = 1,
  FreePlay = 2,
  Tournament = 3,
}

export interface EventFormData {
  location: string;
  leagueId?: string;
  eventTime: Date;
  joinType: EventJoinType;
  eventType: EventType;
  maxParticipants: number;
  isTeamEvent: boolean;
  participants: string[];
  matches: MatchData[];
}

export interface MatchData {
  opponent1Id: string;
  opponent2Id: string;
  matchNumber: number;
  round: number;
}

export interface Participant {
  id: string;
  name: string;
}
