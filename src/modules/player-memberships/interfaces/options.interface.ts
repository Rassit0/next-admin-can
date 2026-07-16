export interface IPlayersOptionsResponse {
  data: IPlayerOption[];
  message: string;
  meta: Meta;
}

export interface IPlayerOption {
  id: string;
  person: IPersonOption;
}

export interface IPersonOption {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  documentNumber: string;
  gender: string;
  birthDate: Date;
  fullName: string;
  imageUrl: string | null;
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
