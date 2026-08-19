export interface ISeasonSummaryResponse {
  data: {
    totalBilled: number;
    totalPaid: number;
    totalPending: number;
    activeMembers: number;
    suspendedMembers: number;
    pendingMembers: number;
    occupiedSlotsCount: number;
    maxMembers: number | null;
  };
  message: string;
}

export interface ICourseSeasonResponse {
  data: ICourseSeason;
  meta?: Meta;
  message: string;
}

export interface ICourseSeasonsResponse {
  data: ICourseSeason[];
  meta: Meta;
  message: string;
}

export type Gender = "MALE" | "FEMALE" | "MIXED";
export type StatusCourseSeason = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELLED";
export type SeasonBillingType = "MONTHLY_ONLY" | "SINGLE_ONLY" | "BOTH";
export type BillingFrequency = "MONTHLY" | "WEEKLY" | "BIWEEKLY" | "SINGLE";

export interface ICourseSeason {
  id: string;
  gender: Gender;
  course: Category;
  category: Category;
  season: Season;
  name: string;
  imageUrl?: string | null;
  description: string | null;
  minBirthYear?: number | null;
  maxBirthYear?: number | null;
  validateAge: boolean;
  shifts: ICourseSeasonShift[];
  status: StatusCourseSeason;
  isRegistrationOpen: boolean;
  billingConfig?: ICourseSeasonBillingConfig;
  _count: {
    studentMemberships: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface Season {
  id: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
}

export interface Shift {
  id: string;
  name: string;
  startTime?: string;
  endTime?: string;
}

export interface ICourseSeasonShift {
  id: string;
  courseSeasonId: string;
  shiftId: string;
  shift: Shift;
  maxMembers: number;
  minMembers: number;
  isActive: boolean;
  _count?: {
    studentMemberships: number;
  };
  courseSeasonStaffs?: any[];
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

export interface ICourseSeasonBillingConfig {
  id?: string;
  billingDay: number;
  registrationFee?: string | null;
  recurringFee?: string | null;
  seasonFee?: string | null;
  billingType: SeasonBillingType;
  billingFrequency: BillingFrequency;
  prorateFirstRecurringFee: boolean;
  prorateLastRecurringFee: boolean;
  prorateRegistrationFee: boolean;
  prorateSeasonFee: boolean;
  debtToleranceMonths: number;
  lateFeeEnabled: boolean;
  lateFeePerDay: string;
  graceDays: number;
}
