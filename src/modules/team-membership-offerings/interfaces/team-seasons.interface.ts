export type StatusTeamSeason = "DRAFT" | "ACTIVE" | "FINISHED" | "CANCELLED";

export interface ITeamSeasonResponse {
  data: ITeamSeason[];
  meta: Meta;
  message: string;
}

export interface ITeamSeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  teamId: string;
  seasonId: string;
  maxMembers: number;
  minMembers: number;
  maxYear: number;
  minYear: number;
  monthlyFee: string;
  registrationFee: string;
  fullPaymentDiscountPercent: string;
  lateFeeEnabled: boolean;
  lateFeePerDay: string;
  graceDays: number;
  suspensionAfterMonthsDue: number;
  status: StatusTeamSeason;
  team: Team;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  club: Club;
}

export interface Club {
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
