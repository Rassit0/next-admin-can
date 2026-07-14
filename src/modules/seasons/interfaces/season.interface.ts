export interface ISeasonsResponse {
  data: ISeason[];
  meta: Meta;
  message: string;
}

export type SeasonStatus = "ACTIVE" | "FINISHED" | "CANCELLED";

export interface ISeasonEvent {
  id: string;
  seasonId: string;
  eventType: "EXTENSION" | "FINALIZATION" | "CANCELLATION";
  originalEndDate: Date | null;
  newEndDate: Date | null;
  reason: string;
  createdAt: Date;
}

export interface ISeason {
  id: string;
  institutionId: string;
  disciplineId: string;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  status: SeasonStatus;
  events?: ISeasonEvent[];
  createdAt: Date;
  updatedAt: Date;
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
