export interface IActivityOptions {
  id: number;
  name: string;
}

export interface IActivitiesOptionsResponse {
  data: IActivityOptions[];
  meta: MetaOptions;
  message: string;
}

export interface IDisciplineOptions {
  id: number;
  name: string;
  icon: string;
}

export interface IDisciplineOptionsResponse {
  data: IDisciplineOptions[];
  meta: MetaOptions;
  message: string;
}

export interface ICategoryOptions {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface ICategoryOptionsResponse {
  data: ICategoryOptions[];
  meta: MetaOptions;
  message: string;
}

export interface ILocationOptionsResponse {
  data: ILocationOptions[];
  message: string;
}

export interface ILocationOptions {
  id: number;
  name: string;
}

export interface MetaOptions {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
