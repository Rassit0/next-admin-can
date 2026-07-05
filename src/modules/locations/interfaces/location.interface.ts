export interface ILocationsResponse {
  data: ILocation[];
  meta: Meta;
  message: string;
}

export interface ILocation {
  id: number;
  name: string;
  address: string;
  description: null | string;
  // isActive: boolean;
  isRentable: boolean;
  isInternal: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null | Date;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
