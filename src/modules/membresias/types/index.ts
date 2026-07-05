import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";

export interface IMember {
  id: string;
  personId: string;
  person?: {
    id: string;
    name: string;
    lastName: string;
    documentType?: string;
    documentNumber?: string;
    email?: string;
    phone?: string;
    imageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IMemberTeamSeasonAssignment {
  id: string;
  memberId: string;
  member?: IMember;
  teamSeasonId: string;
  teamSeason?: ITeamSeason;
  paymentPlanId: string;
  paymentPlan?: IPaymentPlan;
  registrationFeeAmount: number;
  monthlyFeeAmount: number;
  totalInitialCharges: number;
  status: "active" | "suspended" | "completed" | "withdrawn";
  enrolledAt: Date;
  suspendedAt?: Date | null;
  completedAt?: Date | null;
  withdrawnAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMemberTeamSeasonAssignmentResponse {
  data: IMemberTeamSeasonAssignment[];
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
  message: string;
}

export interface IAssignMemberPayload {
  memberId: string;
  teamSeasonId: string;
  paymentPlanId: string;
}

export interface IMembershipMetrics {
  totalMembers: number;
  activeMembers: number;
  suspendedMembers: number;
  completedMembers: number;
  estimatedRevenue: number;
}
