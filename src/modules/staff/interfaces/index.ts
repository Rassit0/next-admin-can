import { IPaginationMeta } from "@/types/api";
import { IPersonBase, TDocumentType, TGender } from "@/modules/persons";

export interface IStaff {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  person: IPersonBase;
}

export const normalizeStaffPerson = (person: any): IPersonBase => ({
  id: person.id,
  name: person.name,
  lastName: person.lastName,
  secondLastName: person.secondLastName || null,
  birthDate: person.birthDate ? new Date(person.birthDate) : null,
  imageUrl: person.imageUrl || null,
  documentType: (person.documentType as TDocumentType) || null,
  documentNumber: person.documentNumber || null,
  email: person.email || null,
  phone: person.phone || null,
  address: person.address || null,
  gender: (person.gender as TGender) || null,
});

export interface IStaffResponse {
  data: IStaff[];
  meta: IPaginationMeta;
  message?: string;
}

export interface IStaffDetailResponse {
  data: IStaff;
  message?: string;
}

export interface UpdateStaffInput {
  isActive?: boolean;
}

export interface IPersonOption {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  fullName: string;
  documentNumber: string | null;
  gender: string | null;
  birthDate: Date | null;
  imageUrl: string | null;
}

export interface IPersonsOptionsResponse {
  data: IPersonOption[];
  meta: IPaginationMeta;
  message?: string;
}
