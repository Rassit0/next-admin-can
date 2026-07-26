import { IPaginationMeta } from "@/types/api";
import { IPerson } from "@/modules/persons";

export interface ITeamSeasonStaff {
  id: string;
  role: "HEAD_COACH" | "ASSISTANT_COACH" | "ASSISTANT" | "VOLUNTEER" | "DELEGATE" | "OTHER";
  customRole: string | null;
  startedAt: string;
  endedAt: string | null;
  isPrimary: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  teamSeason: {
    id: string;
    team: {
      id: string;
      name: string;
    };
  };
  staff: {
    id: string;
    person: IPerson;
  };
}

export interface ITeamSeasonStaffResponse {
  data: ITeamSeasonStaff[];
  meta: IPaginationMeta;
}

export interface IStaffOption {
  id: string; // ID of the Staff
  personId: string;
  name: string;
  lastName: string;
  secondLastName: string | null;
  fullName: string;
  documentNumber: string | null;
  imageUrl: string | null;
  isActive: boolean;
}

export interface IStaffOptionsResponse {
  data: IStaffOption[];
  meta: IPaginationMeta;
}
