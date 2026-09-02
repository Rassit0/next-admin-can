export type StudentMembershipStatus =
  | "PENDING_ACTIVE"
  | "ACTIVE"
  | "SUSPENDED"
  | "WITHDRAWN"
  | "FINISHED";

export type StudentMembershipSuspensionReason =
  | "PAUSE"
  | "MANUAL";

export type CycleEnrollmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED";

export interface ICycleEnrollment {
  id: string;
  cycleStartDate: string;
  cycleEndDate: string;
  status: CycleEnrollmentStatus;
  createdAt: string;
}

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
  courseSeasonShiftId: string;
  courseSeason: {
    id: string;
    name: string;
    course: {
      id: string;
      name: string;
      schoolId: string;
      school: {
        disciplineId: string;
      };
    };
    category: {
      name: string;
    };
    season: {
      name: string;
    };
  };
  courseSeasonShift?: {
    id: string;
    shift: {
      name: string;
    };
    category: {
      name: string;
    };
  };
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
  suspensionReason: StudentMembershipSuspensionReason | null;
  cycleEnrollments: ICycleEnrollment[];
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
    pendingMembers: number;
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

export interface IMembershipHistoryCreator {
  id: string;
  email: string;
  person: {
    name: string;
    lastName: string;
  } | null;
}

export interface IStudentMembershipHistory {
  id: string;
  previousStatus: StudentMembershipStatus | null;
  newStatus: StudentMembershipStatus;
  reason: string | null;
  createdAt: Date;
  createdBy: IMembershipHistoryCreator | null;
}
