export type StatusCourseSeason = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELLED";

export interface ICourseSeasonResponse {
  data: ICourseSeason[];
  meta: Meta;
  message: string;
}

export interface ICourseSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  courseId: string;
  seasonId: string;
  maxMembers: number;
  minMembers: number;
  maxYear: number;
  minYear: number;
  recurringFee: string;
  registrationFee: string;
  fullPaymentDiscountPercent: string;
  lateFeeEnabled: boolean;
  lateFeePerDay: string;
  graceDays: number;
  suspensionAfterMonthsDue: number;
  status: StatusCourseSeason;
  course: Course;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  school: School;
}

export interface School {
  id: string;
  name: string;
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
