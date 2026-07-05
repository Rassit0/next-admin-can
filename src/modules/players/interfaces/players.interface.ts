import { IPerson } from "@/modules/persons";

export interface IPlayersResponse {
  data: IPlayer[];
  meta: Meta;
}

export interface IPlayer {
  id: string;
  person: IPerson;
  isActive: boolean;
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
  nextPage: number | null;
  prevPage: number | null;
}
