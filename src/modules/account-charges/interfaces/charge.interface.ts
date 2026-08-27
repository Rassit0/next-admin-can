import { ICharge } from "@/modules/charge-transactions";
import { IAccountCategory } from "@/modules/account-categories";

export interface IAccountCharge {
  id: string;
  chargeId: string;
  categoryId: string;
  personId?: string;
  referenceId?: string;
  referenceType?: string;
  description?: string;
  title: string;
  externalEntity?: string;
  referenceNumber?: string;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  charge?: ICharge;
  category?: IAccountCategory;
  person?: {
    id: string;
    name: string;
    lastName: string;
  };
  immediateTransaction?: {
    data?: {
      transaction?: {
        id: string;
      };
    };
  };
}

export interface IAccountChargesResponse {
  data: IAccountCharge[];
  meta: {
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  message?: string;
}

