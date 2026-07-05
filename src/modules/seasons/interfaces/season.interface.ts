export interface ISeasonsResponse {
  data: ISeason[];
  meta: Meta;
  message: string;
}

export interface ISeason {
  id: string;
  institutionId: string;
  disciplineId: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
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
