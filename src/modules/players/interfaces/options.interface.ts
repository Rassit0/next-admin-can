export interface IPersonsOptionsResponse {
  data: IPersonOption[];
  message: string;
  meta: Meta;
}

export interface IPersonOption {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  documentNumber: string;
  gender: string;
  birthDate: Date;
  imageUrl: string | null;
  fullName: string;
}

interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}
