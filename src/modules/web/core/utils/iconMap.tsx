// frontend/src/utils/iconMap.tsx
import {
  VolleyballIcon,
  BasketballIcon,
  FootballIcon, // Útil para Futsal
  BookOpenIcon, // Útil para Cursos/Educación
  ActivityIcon, // El genérico por defecto
  TennisBallIcon,
  TennisRacketIcon,
  TableTennisBatIcon,
  Chess01Icon,
  ChampionIcon,
  Dumbbell02Icon,
  Mortarboard02Icon,
  PartyIcon,
  TeamviewerFreeIcons,
  Shield02Icon,
} from "@hugeicons/core-free-icons";

type IconSvgObject =
  | [
      string,
      {
        [key: string]: string | number;
      },
    ][]
  | readonly (readonly [
      string,
      {
        readonly [key: string]: string | number;
      },
    ])[];
export const iconMap: Record<string, IconSvgObject> = {
  volleyball: VolleyballIcon,
  basketball: BasketballIcon,
  futsal: FootballIcon,
  racket: TennisRacketIcon,
  tennis: TennisBallIcon,
  pingpong: TableTennisBatIcon,
  chess: Chess01Icon,
  academic: BookOpenIcon,
  default: ActivityIcon,
  TRAINING: Dumbbell02Icon,
  TOURNAMENT: ChampionIcon,
  EDUCATIONAL: Mortarboard02Icon,
  EVENT: PartyIcon,
  MATCH: FootballIcon,
  TEAM: Shield02Icon,
};

export const iconColorMap: Record<string, string> = {
  TRAINING: "text-warning",
  TOURNAMENT: "text-accent",
  EDUCATIONAL: "text-default-foreground",
  EVENT: "text-success",
  MATCH: "text-tertiary",
  TEAM: "text-foreground",
};

export const iconBgColorMap: Record<string, string> = {
  TRAINING: "bg-warning-soft",
  TOURNAMENT: "bg-accent-soft",
  EDUCATIONAL: "bg-default",
  EVENT: "bg-success-soft",
  MATCH: "bg-tertiary-soft",
  TEAM: "bg-foreground-soft",
};
