export type TeacherGroupType = "COURSE" | "TEAM";

export interface StaffPersonSummary {
  id: string;
  name: string;
  lastName: string;
  secondLastName?: string | null;
  imageUrl?: string | null;
}

export interface TeacherGroup {
  type: TeacherGroupType;
  groupId: string;
  parentId: string;
  name: string;
  detail: string;
  category: string;
  shift?: string | null;
  gender?: string | null;
  role: string;
  customRole?: string | null;
  isPrimary: boolean;
  participantCount: number;
  administrativeCount: number;
  startedAt: string | Date;
  endedAt?: string | Date | null;
}

export interface UpcomingSession {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  durationMin: number;
  location?: {
    id: string;
    name: string;
    address?: string | null;
  } | null;
  groupType: TeacherGroupType;
  groupId: string;
  groupName: string;
  groupDetail: string;
}

export interface TeacherDashboardStats {
  activeGroups: number;
  courseGroups: number;
  teamGroups: number;
  currentParticipants: number;
  administrativeParticipants: number;
  upcomingSessionsCount?: number;
}

export interface TeacherDashboardData {
  staffId: string;
  person: StaffPersonSummary;
  stats: TeacherDashboardStats;
  groups: TeacherGroup[];
  upcomingSessions?: UpcomingSession[];
}

export interface MyGroupsData {
  staffId: string;
  person: StaffPersonSummary;
  groups: TeacherGroup[];
}

export interface StaffContextData {
  isStaff: boolean;
  staffId?: string | null;
  hasAssignments: boolean;
  activeGroupsCount: number;
}

export interface TeacherParticipant {
  type: "STUDENT" | "PLAYER";
  participantId: string;
  personId: string;
  firstName: string;
  lastName: string;
  secondLastName?: string | null;
  membershipId: string;
  imageUrl?: string | null;
  status: string;
  documentNumber?: string | null;
  birthDate?: string | Date | null;
}

export interface TeacherGroupSession {
  id: string;
  eventId: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  durationMin: number;
  location?: {
    id: string;
    name: string;
    address?: string | null;
  } | null;
  status: string;
}

export interface TeacherGroupContext {
  type: TeacherGroupType;
  id: string;
  parentId: string;
  name: string;
  detail: string;
  category: string;
  shift?: string | null;
  gender?: string | null;
  role: string;
  customRole?: string | null;
  isPrimary: boolean;
  participantCount: number;
  administrativeCount: number;
  course?: {
    courseSeasonId: string;
    courseId: string;
    shiftId: string;
    shiftName: string;
  } | null;
  team?: {
    teamSeasonId: string;
    teamId: string;
  } | null;
  participants?: TeacherParticipant[];
  upcomingSessions?: TeacherGroupSession[];
  recentSessions?: TeacherGroupSession[];
}

export interface AttendanceSessionContext {
  id: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  durationMin: number;
  status: string;
  location?: {
    id: string;
    name: string;
    address?: string | null;
  } | null;
}

export interface AttendanceGroupContext {
  type: TeacherGroupType;
  id: string;
  name: string;
  detail: string;
  category?: string | null;
  shift?: string | null;
}

export interface AttendanceIncident {
  id: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdById?: string | null;
}

export interface AttendanceRecord {
  bookingId?: string | null;
  attended: boolean | null;
  incidents?: AttendanceIncident[];
}

export interface AttendanceParticipant {
  participantType: 'STUDENT' | 'PLAYER';
  participantId: string;
  membershipId: string;
  firstName: string;
  lastName: string;
  secondLastName?: string | null;
  imageUrl?: string | null;
  documentNumber?: string | null;
  birthDate?: string | Date | null;
  attendance: AttendanceRecord;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  unregistered: number;
}

export interface SessionAttendanceRoster {
  session: AttendanceSessionContext;
  group: AttendanceGroupContext;
  participants: AttendanceParticipant[];
  summary: AttendanceSummary;
}

export interface BulkAttendanceEntry {
  participantId: string;
  attended: boolean;
}

export interface BulkAttendancePayload {
  entries: BulkAttendanceEntry[];
}

export interface BulkAttendanceResult {
  sessionId: string;
  groupId: string;
  savedCount: number;
  presentCount: number;
  absentCount: number;
}

export interface TeacherEvaluationEvaluator {
  id: string;
  displayName: string;
}

export interface TeacherEvaluationItem {
  id: string;
  evaluationDate: string | Date;
  technicalScore: number | null;
  tacticalScore: number | null;
  physicalScore: number | null;
  behaviorScore: number | null;
  notes: string | null;
  participantId: string;
  participantName: string;
  evaluator: TeacherEvaluationEvaluator;
  canEdit: boolean;
}

export interface TeacherGroupEvaluationsResponse {
  evaluations: TeacherEvaluationItem[];
  total: number;
}

export interface CreateTeacherEvaluationInput {
  participantId: string;
  evaluationDate: string;
  technicalScore?: number | null;
  tacticalScore?: number | null;
  physicalScore?: number | null;
  behaviorScore?: number | null;
  notes?: string | null;
}

export interface UpdateTeacherEvaluationInput {
  evaluationDate?: string;
  technicalScore?: number | null;
  tacticalScore?: number | null;
  physicalScore?: number | null;
  behaviorScore?: number | null;
  notes?: string | null;
}

export interface TeacherLocation {
  id: string;
  name: string;
  address?: string | null;
}

export interface CreateTeacherSessionInput {
  title?: string;
  startDate: string;
  endDate: string;
  durationMin?: number;
  locationId?: string | null;
}

export interface UpdateTeacherSessionInput {
  title?: string;
  startDate?: string;
  endDate?: string;
  durationMin?: number;
  locationId?: string | null;
  status?: string;
}

export interface TeacherSessionDetail {
  id: string;
  eventId: string;
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  durationMin: number;
  status: string;
  location?: TeacherLocation | null;
  hasBookings: boolean;
  bookingsCount: number;
}

export interface TeacherIncidentItem {
  id: string;
  sessionBookingId: string;
  description: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  createdById?: string | null;
  canEdit: boolean;
  participant: {
    id: string;
    name: string;
    lastName: string;
    secondLastName?: string | null;
    imageUrl?: string | null;
    type: 'STUDENT' | 'PLAYER';
  };
  author?: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

export interface TeacherSessionIncidentsResponse {
  incidents: TeacherIncidentItem[];
  total: number;
}

export interface CreateTeacherIncidentInput {
  participantId: string;
  description: string;
}

export interface UpdateTeacherIncidentInput {
  description: string;
}


