export interface IRolesResponse {
  data: Datum[];
  meta: Meta;
  message: string;
}

export interface Datum {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: PermissionElement[];
}

export interface PermissionElement {
  permission: Permission;
}

export interface Permission {
  id: string;
  name: string;
  module: PermissionModule;
}

export interface Meta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: null;
  prevPage: null;
}

export type PermissionModule =
  | "INSTITUTIONS"
  | "LOCATIONS"
  | "DISCIPLINES"
  | "CATEGORIES"
  | "ROLES"
  | "PERMISSIONS"
  | "USERS"
  | "PERSONS"
  | "CLUBS"
  | "TEAMS"
  | "PLAYERS"
  | "TEAM_SEASONS"
  | "STAFF"
  | "TEAM_SEASON_STAFF"
  | "SEASONS"
  | "SCHOOLS"
  | "COURSES"
  | "COURSE_SEASONS"
  | "COURSE_SEASON_STAFF"
  | "STUDENTS"
  | "PAYMENT_PLANS"
  | "STUDENT_MEMBERSHIPS"
  | "PLAYER_MEMBERSHIPS"
  | "MEMBERSHIP_DISCOUNTS"
  | "MEMBERSHIP_CHARGES"
  | "STUDENT_CHARGES"
  | "STUDENT_DISCOUNTS"
  | "TRANSACTIONS"
  | "SCHEDULES"
  | "SESSIONS"
  | "SESSION_BOOKINGS"
  | "MATCHES"
  | "MATCH_LINEUPS"
  | "SESSION_INCIDENTS"
  | "PROGRESS_EVALUATIONS"
  | "AUDIT_LOGS"
  | "DASHBOARD"
  | "SHIFTS"
  | "CHARGES";
