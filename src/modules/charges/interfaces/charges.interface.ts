export interface IChargesResponse {
  data: ICharge[];
  meta: Meta;
  message: string;
}

export type ChargeStatus = "PENDING" | "PARTIAL" | "PAID" | "CANCELLED";

export interface ICharge {
  id: string;
  description: string;
  amount: string;
  pendingAmount: string;
  dueDate: Date;
  status: ChargeStatus;
  parentChargeId: null;
  createdAt: Date;
  updatedAt: Date;
  parentCharge: null | ICharge;
  childCharges: ICharge[];
  membershipCharges: MembershipCharge[];
  studentCharges: any[];
}

export interface MembershipCharge {
  id: string;
  type: string;
  playerMembership: PlayerMembership;
}

export interface PlayerMembership {
  id: string;
  player: Player;
}

export interface Player {
  id: string;
  person: Person;
}

export interface Person {
  id: string;
  name: string;
  lastName: string;
  email: null;
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
