/**
 * GLOBAL API UNIFIED TYPES
 * This file consolidates all domain types from the backend API
 * to maintain a single source of truth for frontend-backend contracts.
 * Auto-generated mapping from https://api.netixtech.net/api/docs-json
 */

// ============================================================================
// COMMON TYPES & INTERFACES
// ============================================================================

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

export interface PaginatedResponse<T> {
  data: T[];
  meta: Meta;
  message: string;
}

// ============================================================================
// INSTITUTIONAL DOMAIN
// ============================================================================

export interface IInstitution {
  id: string;
  name: string;
  code?: string;
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// DISCIPLINES & LOCATIONS
// ============================================================================

export interface IDiscipline {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILocation {
  id: string;
  name: string;
  address: string;
  capacity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CLUBS & TEAMS
// ============================================================================

export interface IClub {
  id: string;
  institutionId: string;
  institution?: IInstitution;
  name: string;
  description?: string;
  foundedYear?: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam {
  id: string;
  clubId: string;
  club?: IClub;
  disciplineId: string;
  discipline?: IDiscipline;
  name: string;
  code?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// CATEGORIES & SEASONS
// ============================================================================

export interface ICategory {
  id: string;
  disciplineId: string;
  discipline?: IDiscipline;
  name: string;
  ageMin?: number;
  ageMax?: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISeason {
  id: string;
  year: number;
  name: string;
  startDate: Date;
  endDate: Date;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// TEAM SEASONS
// ============================================================================

export interface ITeamSeason {
  id: string;
  teamId: string;
  team?: ITeam;
  seasonId: string;
  season?: ISeason;
  categoryId?: string;
  category?: ICategory;
  locationId?: string;
  location?: ILocation;
  registrationFee: number;
  recurringFee: number;
  maxMembers?: number;
  currentMembers: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PERSONS & PLAYERS
// ============================================================================

export interface IPerson {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  documentType?: string;
  documentNumber?: string;
  nationality?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlayer {
  id: string;
  personId: string;
  person?: IPerson;
  position?: string;
  number?: number;
  preferredFoot?: "left" | "right" | "ambidextrous";
  height?: number;
  weight?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PAYMENT PLANS
// ============================================================================

export interface IPaymentPlan {
  id: string;
  teamSeasonId: string;
  name: string;
  registrationDiscountPercent: string;
  recurringDiscountPercent: string;
  seasonFeeDiscountPercent: string;
  isSinglePayment: boolean;
  advanceCycles?: number;
  advanceCyclesDiscountPercent?: string | number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MEMBERSHIP & ASSIGNMENTS
// ============================================================================

export interface IMemberAssignment {
  id: string;
  playerId: string;
  player?: IPlayer;
  teamSeasonId: string;
  teamSeason?: ITeamSeason;
  paymentPlanId: string;
  paymentPlan?: IPaymentPlan;
  registrationFee: number;
  recurringFee: number;
  totalInitialCharges: number;
  status: "active" | "suspended" | "completed" | "withdrawn";
  enrolledAt: Date;
  suspendedAt?: Date | null;
  completedAt?: Date | null;
  withdrawnAt?: Date | null;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// MEMBERSHIP DISCOUNTS
// ============================================================================

export interface IMembershipDiscount {
  id: string;
  membershipId: string;
  membership?: IMemberAssignment;
  discountType: "fixed" | "percentage";
  discountValue: number;
  reason?: string;
  appliedAt: Date;
  expiredAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// PAYMENTS
// ============================================================================

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type PaymentMethod =
  | "credit-card"
  | "debit-card"
  | "bank-transfer"
  | "cash"
  | "check";

export interface IPayment {
  id: string;
  membershipId: string;
  membership?: IMemberAssignment;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  reference?: string;
  transactionId?: string;
  notes?: string;
  failureReason?: string;
  processedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// STAFF & ROLES
// ============================================================================

export interface IRole {
  id: string;
  name: string;
  permissions: string[];
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStaff {
  id: string;
  personId: string;
  person?: IPerson;
  roleId: string;
  role?: IRole;
  employmentDate: Date;
  department?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// UNIFIED RESPONSE TYPES (for compatibility with existing code)
// ============================================================================

export type APIResponse<T> = {
  error: boolean;
  data: T;
  message: string;
};

export type APIPaginatedResponse<T> = APIResponse<PaginatedResponse<T>>;
