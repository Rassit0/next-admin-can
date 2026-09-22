import { NavItem } from "@/ui";
import { PermissionRule } from "@/shared/helpers/permissions";
import { NavigationIconKey } from "@/ui/components/navigation/IconRegistry";

export interface NavigationConfig extends NavItem {
  id?: string;
  label: string;
  href: string;
  icon?: NavigationIconKey;
  description?: string;
  tagText?: string;
  showInLauncher?: boolean;
  showInSidebar?: boolean;
  showInTabs?: boolean;
  requiredPermissions?: PermissionRule;
  highlight?: boolean;
  mobile?: {
    priority?: number;
  };
  entryStrategy?: "firstAllowedChild" | "self";
  routes?: NavigationConfig[];
}

export const itemsNavigation: NavigationConfig[] = [
  {
    id: "quick-operations",
    label: "Operaciones Rápidas",
    href: "quick-operations",
    action: "quick-operations",
    subject: "home",
    icon: "quick-operations",
    highlight: true,
    hiddenInSidebar: true,
    mobile: { priority: 1 },
    entryStrategy: "self",
    routes: [
      {
        id: "quick-ops-person",
        label: "Ficha",
        href: "/admin/quick-operations/[personId]",
        action: "quick-operations",
        subject: "home",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_PERSONS"] },
      },
      {
        id: "quick-ops-dashboard",
        label: "Dashboard",
        href: "/admin/quick-operations/dashboard",
        action: "quick-operations",
        subject: "home",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_DASHBOARD", "READ_TRANSACTIONS"] },
      },
      {
        id: "quick-ops-cash",
        label: "Flujo de Caja",
        href: "/admin/quick-operations/cash-flow",
        action: "quick-operations",
        subject: "home",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_TRANSACTIONS", "READ_CASH_FLOW"] },
      },
      {
        id: "quick-ops-reports",
        label: "Reportes",
        href: "/admin/quick-operations/reports",
        action: "quick-operations",
        subject: "home",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_REPORTS", "READ_TRANSACTIONS"] },
      },
    ],
  },
  {
    id: "dashboard",
    label: "Inicio",
    href: "dashboard",
    action: "dashboard",
    subject: "home",
    icon: "dashboard",
    mobile: { priority: 10 },
  },
  {
    label: "Disciplinas",
    href: "disciplines",
    action: "disciplines",
    subject: "DISCIPLINES",
    icon: "disciplines",
  },
  {
    label: "Instalaciones",
    href: "locations",
    action: "locations",
    subject: "LOCATIONS",
    icon: "locations",
  },
  {
    label: "Categorias",
    href: "categories",
    action: "categories",
    subject: "CATEGORIES",
    icon: "categories",
  },
  {
    label: "Temporadas",
    href: "seasons",
    action: "seasons",
    subject: "SEASONS",
    icon: "seasons",
  },
  {
    label: "Clubes",
    href: "clubs",
    action: "clubs",
    subject: "CLUBS",
    icon: "clubs",
  },
  {
    label: "Equipos",
    href: "teams",
    action: "teams",
    subject: "TEAMS",
    icon: "teams",
    mobile: { priority: 7 },
  },
  {
    label: "Jugadores",
    href: "players",
    action: "players",
    subject: "PLAYERS",
    icon: "players",
  },
  {
    id: "memberships",
    label: "Membresías",
    href: "memberships",
    action: "memberships",
    subject: ["PLAYER_MEMBERSHIPS", "STUDENT_MEMBERSHIPS"],
    icon: "memberships",
    mobile: { priority: 9 },
    entryStrategy: "firstAllowedChild",
    routes: [
      {
        id: "memberships-players",
        label: "Jugadores",
        href: "/admin/memberships/player-memberships",
        action: "memberships",
        subject: "PLAYER_MEMBERSHIPS",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_PLAYER_MEMBERSHIPS"] },
      },
      {
        id: "memberships-students",
        label: "Estudiantes",
        href: "/admin/memberships/student-memberships",
        action: "memberships",
        subject: "STUDENT_MEMBERSHIPS",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_STUDENT_MEMBERSHIPS"] },
      },
    ],
  },
  {
    label: "Escuelas",
    href: "schools",
    action: "schools",
    subject: "SCHOOLS",
    icon: "schools",
  },
  {
    label: "Cursos",
    href: "courses",
    action: "courses",
    subject: "COURSES",
    icon: "courses",
    mobile: { priority: 8 },
  },
  {
    label: "Estudiantes",
    href: "students",
    action: "students",
    subject: "STUDENTS",
    icon: "students",
  },
  {
    id: "accounting",
    label: "Contabilidad",
    href: "accounting",
    action: "accounting",
    subject: ["ACCOUNT_CHARGES", "ACCOUNT_CATEGORIES"],
    icon: "accounting",
    entryStrategy: "firstAllowedChild",
    requiredPermissions: {
      anyOf: [
        "READ_ACCOUNT_CHARGES",
        "READ_TRANSACTIONS",
        "READ_ACCOUNT_CATEGORIES",
        "READ_CASH_FLOW",
      ],
    },
    routes: [
      {
        id: "accounting-dashboard",
        label: "Dashboard",
        href: "/admin/accounting/dashboard",
        action: "accounting",
        subject: "ACCOUNT_CHARGES",
        showInTabs: true,
        requiredPermissions: {
          anyOf: ["READ_ACCOUNT_CHARGES", "READ_TRANSACTIONS"],
        },
      },
      {
        id: "accounting-categories",
        label: "Categorías",
        href: "/admin/accounting/categories",
        action: "accounting",
        subject: "ACCOUNT_CATEGORIES",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_ACCOUNT_CATEGORIES"] },
      },
      {
        id: "accounting-cash-flow",
        label: "Flujo de Caja",
        href: "/admin/accounting/cash-flow",
        action: "accounting",
        subject: "ACCOUNT_CHARGES",
        showInTabs: true,
        requiredPermissions: { anyOf: ["READ_TRANSACTIONS", "READ_CASH_FLOW"] },
      },
    ],
  },
  {
    label: "Turnos",
    href: "shifts",
    action: "shifts",
    subject: "home",
    icon: "shifts",
  },
  {
    label: "Usuarios",
    href: "users/usuarios",
    action: "users",
    subject: "USERS",
    icon: "users",
  },
];

export const itemsWebNavigation: NavigationConfig[] = [
  {
    id: "web-home",
    label: "Inicio",
    href: "home",
    action: "web_home",
    subject: "home",
    icon: "dashboard",
  },
  {
    id: "web-hero-banners",
    label: "Hero Banners",
    href: "hero-banners",
    action: "web_banners",
    subject: "home",
    icon: "categories",
    requiredPermissions: { anyOf: ["READ_BANNERS"] },
  },
  {
    id: "web-home-disciplines",
    label: "Equipos/Escuela",
    href: "home-disciplines",
    action: "web_banners",
    subject: "home",
    icon: "disciplines",
    requiredPermissions: { anyOf: ["READ_BANNERS"] },
  },
  {
    id: "web-news",
    label: "Noticias",
    href: "news",
    action: "web_news",
    subject: "home",
    icon: "news",
    requiredPermissions: { anyOf: ["READ_NEWS"] },
  },
  {
    id: "web-promotions",
    label: "Promociones",
    href: "promotions",
    action: "web_banners",
    subject: "home",
    icon: "categories",
    requiredPermissions: { anyOf: ["READ_PROMOTIONS"] },
  },
];
