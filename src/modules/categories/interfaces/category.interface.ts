export interface ICategoryResponse {
  data: ICategory[];
  meta: Meta;
  message: string;
}

export interface ICategory {
  id: string;
  name: string;
  description: string | null;
  minAge: number;
  maxAge: number;
  discipline: Discipline;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discipline {
  id: string;
  name: string;
  icon: string;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null | number;
  prevPage: null | number;
}
