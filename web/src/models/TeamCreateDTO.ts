export interface TeamCreateDTO {
  teamManagerIds: string[];
  name: string;
  teamUserIds: string[];
}

export interface TeamUpdateDTO {
  id: string;
  name: string;
  teamUserIds: string[];
}
