export interface IDisciplineOptions {
  id: string;
  name: string;
  icon: string;
}

export interface IDisciplineOptionsResponse {
  data: IDisciplineOptions[];
  message: string;
}

export interface ISchoolOptions {
  id: string;
  name: string;
  discipline: IDisciplineOptions;
}

export interface ISchoolOptionsResponse {
  data: ISchoolOptions[];
  message: string;
}
