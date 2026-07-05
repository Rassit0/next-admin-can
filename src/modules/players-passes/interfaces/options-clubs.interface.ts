export interface IClubOptionsByDiscipline {
  id: string;
  name: string;
  discipline: {
    id: string;
    name: string;
    icon: string;
  };
}

export interface IClubOptionsByDisciplineResponse {
  data: IClubOptionsByDiscipline[];
  message: string;
}
