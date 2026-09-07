export type MembershipHistoryType = "team" | "course";

export interface IMembershipHistoryItem {
  id: string;
  type: MembershipHistoryType;
  status: string;
  startedAt: string;
  endedAt: string | null;
  createdAt: string;

  // Detalles para Team
  teamName?: string;
  categoryName?: string;
  disciplineName?: string;
  seasonName?: string;

  // Detalles para Course
  courseName?: string;
  institutionName?: string;
  shiftName?: string;
}

