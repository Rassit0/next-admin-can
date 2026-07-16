import { IPerson } from "@/modules/persons";

export interface IStudentsResponse {
  data: IStudent[];
  meta: Meta;
}

export interface IStudent {
  id: string;
  person: IPerson;
  isActive: boolean;
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
