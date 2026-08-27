export interface IAccountCategory {
  id: string;
  name: string;
  code: string;
  description?: string;
  type: "RECEIVABLE" | "PAYABLE";
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccountCategoriesResponse {
  data: IAccountCategory[];
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

