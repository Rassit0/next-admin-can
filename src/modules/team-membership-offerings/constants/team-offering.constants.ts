import { StatusTeamSeason } from "../interfaces/team-seasons.interface";

export const STATUS_TITLE_MAP: Record<StatusTeamSeason, string> = {
  ACTIVE: "Ciclo Activo",
  DRAFT: "Próximo Lanzamiento",
  FINISHED: "Ciclo Finalizado",
  CANCELLED: "Ciclo Cancelado",
};

export const STATUS_CHIP_CLASS_MAP: Record<StatusTeamSeason, string> = {
  ACTIVE: "bg-accent-soft text-accent",
  DRAFT: "bg-warning-soft text-warning",
  FINISHED: "bg-success-soft text-success",
  CANCELLED: "bg-danger-soft text-danger",
};

export const STATUS_TEXT_MAP: Record<StatusTeamSeason, string> = {
  ACTIVE: "Activo",
  DRAFT: "Borrador",
  FINISHED: "Finalizado",
  CANCELLED: "Cancelado",
};
