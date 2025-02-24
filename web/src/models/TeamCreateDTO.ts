export interface TeamCreateDTO {
  leagueId: string;
  teamManagerIds: string[];
  name: string;
  teamUserIds: string[];
}

export interface TeamUpdateDTO {
  id: string;
  name: string;
  teamUserIds: string[];
}
