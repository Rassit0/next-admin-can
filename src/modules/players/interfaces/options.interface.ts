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
  documentNumber: string | null;
  documentType: string | null;
  gender: string | null;
  birthDate: Date | null;
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
