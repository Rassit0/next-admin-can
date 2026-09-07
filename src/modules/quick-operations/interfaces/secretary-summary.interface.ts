export interface IChargeSummary {
  id: string;
  description?: string;
  amount: number;
  pendingAmount: number;
  adjustmentAmount: number;
  adjustmentReason?: string;
  dueDate: string;
  status: string;
  type: "MEMBERSHIP" | "STUDENT" | "ACCOUNT";
  originName: string;
  membershipCharges: { type: string }[];
  studentCharges: { type: string }[];
  payments: { amount: string | number; status: string }[];
}

export interface IPlayerMembershipSummary {
  id: string;
  disciplineName: string;
  categoryName: string;
  teamName: string;
  status: string;
  startedAt: string;
}

export interface IStudentMembershipSummary {
  id: string;
  courseName: string;
  institutionName: string;
  status: string;
  startedAt: string;
  shiftName?: string | null;
  shiftStartTime?: string | null;
  shiftEndTime?: string | null;
}

export interface IPersonProfileSummary {
  id: string;
  name: string;
  lastName: string;
  secondLastName?: string;
  documentNumber?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  playerId?: string;
  studentId?: string;
}

export interface ISecretarySummaryData {
  profile: IPersonProfileSummary;
  playerMemberships: IPlayerMembershipSummary[];
  studentMemberships: IStudentMembershipSummary[];
  pendingCharges: IChargeSummary[];
}

export interface ISecretarySummaryResponse {
  data: ISecretarySummaryData;
  message: string;
}
