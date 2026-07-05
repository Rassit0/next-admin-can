export interface IPlayerPassActiveOptions {
  id: string;
  currentTeam: ICurrentTeam;
}

export interface IPlayerPassActiveOptionsResponse {
  data: IPlayerPassActiveOptions[];
  message: string;
}

export interface ICurrentTeam {
  id: string;
  name: string;
  club: IClubCurrentTeam;
}

export interface IClubCurrentTeam {
  id: string;
  name: string;
  discipline: IDisciplineCurrentTeam;
}

export interface IDisciplineCurrentTeam {
  id: string;
  name: string;
  icon: string;
}
