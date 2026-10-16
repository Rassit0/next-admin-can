import { TeacherGroupType } from "../interfaces/teacher.interface";

export const GROUP_TYPE_LABELS: Record<TeacherGroupType, string> = {
  COURSE: "Escuela Deportiva",
  TEAM: "Equipo Competitivo",
};

export const formatGroupType = (type?: TeacherGroupType | string | null): string => {
  if (!type) return "Grupo Deportivo";
  const normalized = type.toUpperCase() as TeacherGroupType;
  return GROUP_TYPE_LABELS[normalized] || type;
};
