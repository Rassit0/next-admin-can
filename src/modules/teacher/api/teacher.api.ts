import { api } from "@/utils/api";
import {
  StaffContextData,
  TeacherDashboardData,
  MyGroupsData,
  TeacherGroupContext,
  TeacherGroupSession,
  SessionAttendanceRoster,
  BulkAttendancePayload,
  BulkAttendanceResult,
  TeacherEvaluationItem,
  TeacherGroupEvaluationsResponse,
  CreateTeacherEvaluationInput,
  UpdateTeacherEvaluationInput,
  TeacherLocation,
  CreateTeacherSessionInput,
  UpdateTeacherSessionInput,
  TeacherSessionDetail,
  TeacherIncidentItem,
  TeacherSessionIncidentsResponse,
  CreateTeacherIncidentInput,
  UpdateTeacherIncidentInput,
} from "../interfaces/teacher.interface";

export const fetchTeacherContext = async (): Promise<StaffContextData> => {
  const res = await api.get<StaffContextData | { data: StaffContextData }>(
    "staff/me/context",
    {
      cache: "no-store",
    },
  );

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.isStaff !== undefined
  ) {
    return (res as any).data;
  }

  return res as StaffContextData;
};

export const fetchTeacherDashboard = async (): Promise<TeacherDashboardData> => {
  const res = await api.get<
    TeacherDashboardData | { data: TeacherDashboardData }
  >("staff/me/dashboard", {
    cache: "no-store",
  });

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.stats
  ) {
    return (res as any).data;
  }

  return res as TeacherDashboardData;
};

export const fetchMyGroups = async (): Promise<MyGroupsData> => {
  const res = await api.get<MyGroupsData | { data: MyGroupsData }>(
    "staff/me/groups",
    {
      cache: "no-store",
    },
  );

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.groups
  ) {
    return (res as any).data;
  }

  return res as MyGroupsData;
};

export const fetchTeacherGroupContext = async (
  type: string,
  groupId: string,
): Promise<TeacherGroupContext> => {
  const res = await api.get<
    TeacherGroupContext | { data: TeacherGroupContext }
  >(`staff/me/groups/${type}/${groupId}`, {
    cache: "no-store",
  });

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.id
  ) {
    return (res as any).data;
  }

  return res as TeacherGroupContext;
};

export const fetchSessionAttendanceRoster = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<SessionAttendanceRoster> => {
  const res = await api.get<
    SessionAttendanceRoster | { data: SessionAttendanceRoster }
  >(`staff/me/groups/${type}/${groupId}/sessions/${sessionId}/attendance`, {
    cache: "no-store",
  });

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.session
  ) {
    return (res as any).data;
  }

  return res as SessionAttendanceRoster;
};

export const putBulkSessionAttendance = async (
  type: string,
  groupId: string,
  sessionId: string,
  payload: BulkAttendancePayload,
): Promise<BulkAttendanceResult> => {
  const res = await api.put<
    BulkAttendanceResult | { data: BulkAttendanceResult }
  >(`staff/me/groups/${type}/${groupId}/sessions/${sessionId}/attendance`, payload);

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.sessionId
  ) {
    return (res as any).data;
  }

  return res as BulkAttendanceResult;
};

export const fetchGroupEvaluations = async (
  type: string,
  groupId: string,
  participantId?: string,
): Promise<TeacherGroupEvaluationsResponse> => {
  const query = participantId
    ? `?participantId=${encodeURIComponent(participantId)}`
    : "";
  const res = await api.get<
    TeacherGroupEvaluationsResponse | { data: TeacherGroupEvaluationsResponse }
  >(`staff/me/groups/${type}/${groupId}/evaluations${query}`, {
    cache: "no-store",
  });

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.evaluations
  ) {
    return (res as any).data;
  }

  return res as TeacherGroupEvaluationsResponse;
};

export const postGroupEvaluation = async (
  type: string,
  groupId: string,
  payload: CreateTeacherEvaluationInput,
): Promise<TeacherEvaluationItem> => {
  const res = await api.post<
    TeacherEvaluationItem | { data: TeacherEvaluationItem }
  >(`staff/me/groups/${type}/${groupId}/evaluations`, payload);

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.id
  ) {
    return (res as any).data;
  }

  return res as TeacherEvaluationItem;
};

export const patchGroupEvaluation = async (
  type: string,
  groupId: string,
  evaluationId: string,
  payload: UpdateTeacherEvaluationInput,
): Promise<TeacherEvaluationItem> => {
  const res = await api.patch<
    TeacherEvaluationItem | { data: TeacherEvaluationItem }
  >(`staff/me/groups/${type}/${groupId}/evaluations/${evaluationId}`, payload);

  if (
    res &&
    typeof res === "object" &&
    "data" in res &&
    (res as any).data?.id
  ) {
    return (res as any).data;
  }

  return res as TeacherEvaluationItem;
};

export const fetchTeacherLocations = async (): Promise<TeacherLocation[]> => {
  const res = await api.get<TeacherLocation[] | { data: TeacherLocation[] }>(
    "staff/me/locations",
    { cache: "no-store" },
  );

  if (res && typeof res === "object" && "data" in res && Array.isArray((res as any).data)) {
    return (res as any).data;
  }

  return Array.isArray(res) ? res : [];
};

export const postGroupSession = async (
  type: string,
  groupId: string,
  payload: CreateTeacherSessionInput,
): Promise<TeacherGroupSession> => {
  const res = await api.post<TeacherGroupSession | { data: TeacherGroupSession }>(
    `staff/me/groups/${type}/${groupId}/sessions`,
    payload,
  );

  if (res && typeof res === "object" && "data" in res && (res as any).data?.id) {
    return (res as any).data;
  }

  return res as TeacherGroupSession;
};

export const fetchGroupSession = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<TeacherSessionDetail> => {
  const res = await api.get<TeacherSessionDetail | { data: TeacherSessionDetail }>(
    `staff/me/groups/${type}/${groupId}/sessions/${sessionId}`,
    { cache: "no-store" },
  );

  if (res && typeof res === "object" && "data" in res && (res as any).data?.id) {
    return (res as any).data;
  }

  return res as TeacherSessionDetail;
};

export const patchGroupSession = async (
  type: string,
  groupId: string,
  sessionId: string,
  payload: UpdateTeacherSessionInput,
): Promise<TeacherGroupSession> => {
  const res = await api.patch<TeacherGroupSession | { data: TeacherGroupSession }>(
    `staff/me/groups/${type}/${groupId}/sessions/${sessionId}`,
    payload,
  );

  if (res && typeof res === "object" && "data" in res && (res as any).data?.id) {
    return (res as any).data;
  }

  return res as TeacherGroupSession;
};

export const cancelGroupSession = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<TeacherGroupSession> => {
  const res = await api.post<TeacherGroupSession | { data: TeacherGroupSession }>(
    `staff/me/groups/${type}/${groupId}/sessions/${sessionId}/cancel`,
    {},
  );

  if (res && typeof res === "object" && "data" in res && (res as any).data?.id) {
    return (res as any).data;
  }

  return res as TeacherGroupSession;
};

export const fetchGroupSessionIncidents = async (
  type: string,
  groupId: string,
  sessionId: string,
): Promise<TeacherSessionIncidentsResponse> => {
  const res = await api.get<
    TeacherSessionIncidentsResponse | { data: TeacherSessionIncidentsResponse }
  >(`staff/me/groups/${type}/${groupId}/sessions/${sessionId}/incidents`, {
    cache: "no-store",
  });

  if (res && typeof res === "object" && "data" in res && (res as any).data?.incidents) {
    return (res as any).data;
  }

  return res as TeacherSessionIncidentsResponse;
};

export const postGroupSessionIncident = async (
  type: string,
  groupId: string,
  sessionId: string,
  payload: CreateTeacherIncidentInput,
): Promise<TeacherIncidentItem> => {
  const res = await api.post<TeacherIncidentItem | { data: TeacherIncidentItem }>(
    `staff/me/groups/${type}/${groupId}/sessions/${sessionId}/incidents`,
    payload,
  );

  if (res && typeof res === "object" && "data" in res && (res as any).data?.id) {
    return (res as any).data;
  }

  return res as TeacherIncidentItem;
};

export const patchGroupSessionIncident = async (
  type: string,
  groupId: string,
  sessionId: string,
  incidentId: string,
  payload: UpdateTeacherIncidentInput,
): Promise<TeacherIncidentItem> => {
  const res = await api.patch<TeacherIncidentItem | { data: TeacherIncidentItem }>(
    `staff/me/groups/${type}/${groupId}/sessions/${sessionId}/incidents/${incidentId}`,
    payload,
  );

  if (res && typeof res === "object" && "data" in res && (res as any).data?.id) {
    return (res as any).data;
  }

  return res as TeacherIncidentItem;
};


