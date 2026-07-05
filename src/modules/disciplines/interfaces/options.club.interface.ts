export interface IDisciplineOptions {
  id: string;
  name: string;
  icon: string;
}

export interface IDisciplineOptionsResponse {
  data: IDisciplineOptions[];
  message: string;
}

export interface IClubOptions {
  id: string;
  name: string;
  discipline: IDisciplineOptions;
}

export interface IClubOptionsResponse {
  data: IClubOptions[];
  message: string;
}
