export interface ITeamCategoriesResponse {
  data: ITeamCategory[];
  meta: Meta;
  message: string;
}

export type ProgramGender = "MALE" | "FEMALE" | "MIXED";

export interface ITeamCategory {
  id: string;
  gender: ProgramGender;
  team: Team;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  club: Club;
}

export interface Category {
  id: string;
  name: string;
}

export interface Club {
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
