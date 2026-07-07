export interface IClubsResponse {
  data: IClub[];
  meta: Meta;
  message: string;
}

export interface IClub {
  id: string;
  name: string;
  shortName?: string;
  organization: Organization;
  // discipline: Discipline;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
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
