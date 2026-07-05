export interface IPersonsResponse {
  data: IPerson[];
  meta: Meta;
}

export type TGender = "MALE" | "FEMALE";
export type TDocumentType = "CI" | "NIT";

export interface IPerson {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  birthDate: Date | null;
  imageUrl: string | null;
  documentType: TDocumentType;
  documentNumber: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: TGender;
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
  nextPage: number | null;
  prevPage: number | null;
}
