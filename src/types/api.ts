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
