export type TeamOptionsGender = "MALE" | "FEMALE";

export interface ITeamsByClubOptions {
  id: string;
  name: string;
  gender: TeamOptionsGender;
  discipline: {
    id: string;
    name: string;
    icon: string;
  };
}

export interface ITeamsByClubOptionsResponse {
  data: ITeamsByClubOptions[];
  message: string;
}
