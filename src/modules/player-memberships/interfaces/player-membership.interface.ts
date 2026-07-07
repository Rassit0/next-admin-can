export type PlayerMembershipStatus =
  | "PENDING_ACTIVE"
  | "ACTIVE"
  | "SUSPENDED"
  | "WITHDRAWN"
  | "FINISHED";

export interface IMembershipPerson {
  id: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  imageUrl: string | null;
  documentType: string;
  documentNumber: string;
  email: string | null;
  phone: string | null;
}

export interface IMembershipPlayer {
  id: string;
  person: IMembershipPerson;
}

export interface IMembershipPaymentPlan {
  id: string;
  name: string;
  registrationDiscountPercent: string;
  recurringDiscountPercent: string;
}

export interface IPlayerMembership {
  id: string;
  playerId: string;
  teamSeasonId: string;
  paymentPlanId: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: PlayerMembershipStatus;
  player?: IMembershipPlayer;
  paymentPlan?: IMembershipPaymentPlan;
  createdAt: Date;
  updatedAt: Date;
  totalPendingAmount: number;
}

export interface IPlayerMembershipResponse {
  data: IPlayerMembership[];
  meta: Meta;
  message: string;
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
