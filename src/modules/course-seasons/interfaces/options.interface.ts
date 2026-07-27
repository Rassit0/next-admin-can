export interface ICategoriesOptionsResponse {
  data: ICategoryOption[];
  message: string;
}

export interface ICategoryOption {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface ISeasonsOptionsResponse {
  data: ISeasonOption[];
  message: string;
}

export interface ISeasonOption {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface IShiftsOptionsResponse {
  data: IShiftOption[];
  message: string;
}

export interface IShiftOption {
  id: string;
  name: string;
}
