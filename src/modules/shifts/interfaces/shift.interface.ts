export interface IShiftResponse {
  data: IShift[];
  meta: Meta;
  message: string;
}

export interface IShift {
  id: string;
  name: string;
  institutionId?: string;
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
