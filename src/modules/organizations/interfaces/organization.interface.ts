export interface IOrganizationsResponse {
  data: IOrganization[];
  meta: Meta;
  message: string;
}

export interface IOrganization {
  id: string;
  name: string;
  imageUrl: null | string;
  address: string;
  email: null | string;
  phone: null | string;
  clubs: Club[];
  schools: School[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Club {
  id: string;
  name: string;
}

export interface School {
  id: string;
  name: string;
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
