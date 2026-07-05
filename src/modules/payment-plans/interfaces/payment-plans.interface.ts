export interface IPaymentPlanResponse {
  data: IPaymentPlan[];
  meta: Meta;
  message: string;
}

export interface IPaymentPlan {
  id: string;
  teamSeasonId: string;
  name: string;
  registrationDiscountPercent: string;
  monthlyDiscountPercent: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Discipline {
  id: string;
  name: string;
  icon: string;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null | number;
  prevPage: null | number;
}
