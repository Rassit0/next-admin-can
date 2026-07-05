export type ActivityType =
  | "TRAINING" // Entrenamientos (recurrentes)
  | "MATCH" // Partidos (evento puntual deportivo)
  // | "TOURNAMENT" // Campeonatos / ligas
  | "EDUCATIONAL" // Escuelas / cursos
  | "EVENT" // Eventos sociales o generales
  | "TEAM"; // Equipos

export type ActivitySkillLevel =
  | "BEGINNER" // Principiante
  | "INTERMEDIATE" // Intermedio
  | "ADVANCED" // Avanzado
  | "ELITE" // Avanzado
  | "NA"; // No aplica

export type ActivityStatus = "DRAFT" | "PUBLISHED" | "FINISHED" | "CANCELLED";

export interface IActivitiesResponse {
  data: IActivity[];
  meta: Meta;
  message: string;
}

export interface IActivity {
  id: number;
  name: string;
  type: ActivityType;
  level: ActivitySkillLevel;
  startDate: Date;
  endDate: Date;
  totalPrice: string;
  monthlyPrice: string;
  registrationFee: string;
  maxMembers: number;
  minMembers: number;
  staffRequired: number | null;
  parentId: null | number;
  organizationId: number | null;
  organization: {
    id: number;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  status: ActivityStatus;
  deletedAt: null | Date;
  activityCategories: ActivityCategory[];
  matchDetails: MatchDetail[];
}

export interface ActivityCategory {
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  minAge: number;
  maxAge: number;
}

export interface MatchDetail {
  awayTeam: null;
  homeTeam: null;
  location: Location;
  matchDate: Date;
  scoreAway: number;
  scoreHome: number;
}

export interface Location {
  id: number;
  name: string;
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

export interface IActivitySummary {
  totalActivities: number;
  publishedActivities: number;
  finishedActivities: number;
  cancelledActivities: number;
}
