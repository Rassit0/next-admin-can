export interface IPlayersPassesResponse {
  data: IPlayerPass[];
  meta: Meta;
}

export type PlayerPassStatus =
  | "PENDING"
  | "ACTIVE"
  | "INACTIVE"
  | "CATEGORY_EXPIRED"
  | "REJECTED";
export type PlayerPassOriginType =
  | "OWN"
  | "INTERNAL"
  | "EXTERNAL"
  | "FREE_AGENT";

export interface IPlayerPass {
  id: string;
  player: IPlayer;
  isActive: boolean;
  externalPreviousTeamName: string | null;
  previousTeam: null | ITeam;
  externalNextTeamName: string | null; // Si se cierra el pase indicar a que equipo se va, opcional para cuando es pase externo
  currentTeam: ITeam;
  originType: PlayerPassOriginType;
  startDate: Date;
  endDate: Date | null;
  status: PlayerPassStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type Gender = "MALE" | "FEMALE";
export type DocumentType = "CI" | "NIT";

export interface IPlayer {
  id: string;
  person: IPerson;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITeam {
  id: string;
  name: string;
  club: IClub;
}

export interface IClub {
  id: string;
  name: string;
  discipline: IDiscipline;
}

export interface IDiscipline {
  id: string;
  name: string;
  icon: string;
}

export interface IPerson {
  imageUrl: null | string;
  name: string;
  lastName: string;
  secondLastName: string;
  birthDate: null | Date;
  documentType: DocumentType;
  documentNumber: string;
  gender: Gender;
  email: string | null;
  phone: string | null;
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
