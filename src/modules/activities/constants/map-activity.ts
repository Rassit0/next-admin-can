import { ActivityStatus, ActivityType } from "../interfaces/activity.interface";

export const colorStatusActivity: Record<ActivityStatus, string> = {
  DRAFT: "warning",
  PUBLISHED: "accent",
  FINISHED: "success",
  CANCELLED: "danger",
};

export const colorBgStatusActivity: Record<ActivityStatus, string> = {
  DRAFT: "bg-warning-soft",
  PUBLISHED: "bg-accent-soft",
  FINISHED: "bg-success-soft",
  CANCELLED: "bg-danger-soft",
};

export const colorTextStatusActivity: Record<ActivityStatus, string> = {
  DRAFT: "text-warning",
  PUBLISHED: "text-accent",
  FINISHED: "text-success",
  CANCELLED: "text-danger",
};

export const textStatusActivity: Record<ActivityStatus, string> = {
  DRAFT: "Borrador",
  PUBLISHED: "Publicado",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};

export const colorBgTextStatusActivity: Record<ActivityStatus, string> = {
  DRAFT: "bg-warning-soft text-warning",
  PUBLISHED: "bg-accent-soft text-accent",
  FINISHED: "bg-success-soft text-success",
  CANCELLED: "bg-danger-soft text-danger",
};

export const textTypeActivity: Record<ActivityType, string> = {
  TEAM: "Equipo",
  TRAINING: "Entrenamiento",
  MATCH: "Partido",
  EDUCATIONAL: "Educativo",
  EVENT: "Evento",
};
