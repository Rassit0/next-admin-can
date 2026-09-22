import { NavItem } from "@/ui";

export const itemsNavigationClubs: NavItem[] = [
  {
    label: "Dashboard",
    href: "dashboard",
    action: "dashboard",
    subject: "home",
    icon: "dashboard",
  },
  {
    label: "Temporadas",
    href: "seasons",
    action: "seasons",
    subject: "home",
    icon: "seasons",
  },
  {
    label: "Clubes",
    href: "manage",
    action: "clubs",
    subject: "home",
    icon: "clubs",
  },
  // {
  //   label: "Equipos",
  //   href: "teams",
  //   action: "teams",
  //   subject: "home",
  //   icon: "teams",
  // },
  {
    label: "Pases",
    href: "passes",
    action: "passes",
    subject: "home",
    icon: "quick-operations", // Assuming arrow transfer translates to quick-operations or something similar
  },
  {
    label: "Jugadores",
    href: "players",
    action: "players",
    subject: "home",
    icon: "players",
  },
  {
    label: "Asistencia",
    href: "attendance",
    action: "attendance",
    subject: "home",
    icon: "attendance", // You might need to add tasks to IconRegistry if it fails
  },
];
