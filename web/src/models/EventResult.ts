export interface EventResult {
  id: string;
  eventId: string;
  winningTeamId?: string;
  winningUserId?: string;
  score: string;
  starPlayerUserId?: string;
  location: string;
  eventTime: string;
}
