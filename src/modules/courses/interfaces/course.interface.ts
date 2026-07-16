export interface ICoursesResponse {
  data: ICourse[];
  meta: Meta;
  message: string;
}

export interface ICourse {
  id: string;
  name: string;
  shortName?: string | null;
  description: string | null;
  school: School;
  createdAt: Date;
  updatedAt: Date;
}

export interface School {
  id: string;
  name: string;
  discipline: Discipline;
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
