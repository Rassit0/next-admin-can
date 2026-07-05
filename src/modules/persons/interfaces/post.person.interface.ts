import { TGender } from "./person.interface";

export interface PostPersonInterface {
  name: string;
  lastName: string;
  secondLastName?: string | null;
  birthDate?: Date | null;
  image?: File | null;
  documentType: string;
  documentNumber: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  gender: TGender;
}
