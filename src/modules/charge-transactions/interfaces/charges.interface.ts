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
  adjustmentAmount?: string | number;
  adjustmentReason?: string | null;
  dueDate: Date;
  status: ChargeStatus;
  parentChargeId: null;
  createdAt: Date;
  updatedAt: Date;
  parentCharge: null | ICharge;
  childCharges: ICharge[];
  membershipCharges: MembershipCharge[];
  studentCharges: StudentCharge[];
  payments?: { amount: string | number; status: string }[];
}

export interface StudentCharge {
  id: string;
  type: string;
  studentMembership: StudentMembership;
}

export interface StudentMembership {
  id: string;
  student: Student;
}

export interface Student {
  id: string;
  person: Person;
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
  secondLastName?: string | null;
  documentNumber?: string | null;
  gender?: string | null;
  birthDate?: string | Date | null;
  imageUrl?: string | null;
  email: string | null;
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
