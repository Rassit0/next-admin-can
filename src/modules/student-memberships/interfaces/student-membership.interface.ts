export type StudentMembershipStatus =
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

export interface IMembershipStudent {
  id: string;
  person: IMembershipPerson;
}

export interface IMembershipPaymentPlan {
  id: string;
  name: string;
  registrationDiscountPercent: string;
  recurringDiscountPercent: string;
}

export interface IStudentMembership {
  id: string;
  studentId: string;
  courseSeasonId: string;
  paymentPlanId: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: StudentMembershipStatus;
  student?: IMembershipStudent;
  paymentPlan?: IMembershipPaymentPlan;
  createdAt: Date;
  updatedAt: Date;
  totalPendingAmount: number;
  totalPaidAmount: number;
  pauses?: IStudentMembershipPause[];
}

export interface IStudentMembershipPause {
  id: string;
  studentMembershipId: string;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudentMembershipResponse {
  data: IStudentMembership[];
  meta: Meta;
  summary?: {
    totalBilled: number;
    totalPaid: number;
    totalPending: number;
    activeMembers: number;
    suspendedMembers: number;
    occupiedSlotsCount: number;
    maxMembers: number | null;
  };
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
