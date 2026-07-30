// src/types/api.ts
export type ServiceResponse<T> =
  | { error: false; data: T; message: string }
  | {
      error: true;
      data?: null;
      message: string;
      errors?: any;
      statusCode: number;
    };

export interface IPaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: IPaginationMeta;
  message?: string;
}
