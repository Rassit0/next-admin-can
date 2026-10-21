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
  teamSeasonCategoryId: string;
  teamSeason: {
    team: {
      id: string;
      name: string;
      clubId: string;
      club: {
        disciplineId: string;
      };
    };
    season: {
      name: string;
    };
  };
  teamSeasonCategories?: {
    category: {
      id: string;
      name: string;
    };
  };
  paymentPlanId: string;
  startedAt: Date;
  finishedAt: Date | null;
  status: PlayerMembershipStatus;
  player?: IMembershipPlayer;
  paymentPlan?: IMembershipPaymentPlan;
  createdAt: Date;
  updatedAt: Date;
  totalPendingAmount: number;
  totalPaidAmount: number;
  pauses?: IPlayerMembershipPause[];
}

export interface IPlayerMembershipPause {
  id: string;
  playerMembershipId: string;
  startDate: Date;
  endDate: Date;
  reason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayerMembershipResponse {
  data: IPlayerMembership[];
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

export interface IReenterPlayerMembershipDto {
  previousMembershipId: string;
  teamSeasonCategoryId: string;
  paymentPlanId: string;
  startedAt: string;
  chargeRegistration?: boolean;
  skipCurrentMonthRecurringFee?: boolean;
  notes?: string;
}

export interface IPlayerMembershipReentryInfo {
  player: {
    id: string;
    personId: string;
    fullName: string;
    documentNumber?: string | null;
    birthDate?: string | null;
  };
  previousMembership: {
    id: string;
    teamSeasonId: string;
    teamSeasonName: string;
    categoryName: string;
    startedAt: string;
    endedAt: string | null;
    withdrawalReason: string | null;
  };
  registrationFeeStatus: {
    hasPaidInSeason: boolean;
    paidAmount?: number;
    paymentDate?: string;
    receiptNumber?: string;
    seasonFeeAmount: number;
  };
  currentMonthStatus: {
    currentYear: number;
    currentMonth: number;
    hasPaidCurrentMonth: boolean;
    paidAmount?: number;
    receiptNumber?: string;
  };
  historicalDebts: {
    hasPendingDebts: boolean;
    totalPendingAmount: number;
    pendingCharges: {
      id: string;
      description: string;
      amount: number;
      pendingAmount: number;
      dueDate: string;
      type: string;
    }[];
  };
  cancelledChargesOnWithdrawal: {
    id: string;
    description: string;
    amount: number;
    dueDate: string;
  }[];
  availableCategories: {
    id: string;
    name: string;
    maxMembers: number | null;
    activeMembers: number;
    availableSpots: number | null;
    isCurrentCategory: boolean;
  }[];
  availablePaymentPlans: {
    id: string;
    name: string;
    registrationDiscountPercent: number;
    recurringDiscountPercent: number;
    isSinglePayment: boolean;
    advanceCycles: number;
  }[];
}
