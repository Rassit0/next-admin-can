export interface IStudentsOptionsResponse {
  data: IStudentOption[];
  message: string;
  meta: Meta;
}

export interface IStudentOption {
  id: string;
  person: IPersonOption;
}

export interface IPersonOption {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  documentNumber: string | null;
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
