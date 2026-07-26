import { IPaginationMeta } from "@/types/api";

export interface IStaff {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  person: {
    id: string;
    name: string;
    lastName: string;
    secondLastName: string | null;
    documentNumber: string;
    gender: string;
    birthDate: Date;
    imageUrl: string | null;
  };
}

export interface IStaffResponse {
  data: IStaff[];
  meta: IPaginationMeta;
  message?: string;
}

export interface IPersonOption {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  fullName: string;
  documentNumber: string;
  gender: string;
  birthDate: Date;
  imageUrl: string | null;
}

export interface IPersonsOptionsResponse {
  data: IPersonOption[];
  meta: IPaginationMeta;
  message?: string;
}
