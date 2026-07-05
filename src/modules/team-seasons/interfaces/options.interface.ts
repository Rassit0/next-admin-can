export interface ICategoriesOptionsResponse {
  data: ICategoryOption[];
  message: string;
}

export interface ICategoryOption {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface ISeasonsOptionsResponse {
  data: ISeasonOption[];
  message: string;
}

export interface ISeasonOption {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}
