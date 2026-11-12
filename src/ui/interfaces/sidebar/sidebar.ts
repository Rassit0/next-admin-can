// export type Action = 'read' | 'create' | 'update' | 'delete' | 'manage'
export type Action = string;

export type NavGroupKey =
  | "general"
  | "sports"
  | "academic"
  | "finance"
  | "admin";

export interface NavItems {
  title?: string;
  items: NavItem[];
}

export interface NavItem {
  id?: string;
  label: string;
  shortLabel?: string;
  icon?: string;
  href: string; // obligatorio si no hay subMenu
  action: Action;
  subject: string | string[];
  children?: never; // no permitido
  group?: NavGroupKey;

  mobile?: {
    visible?: boolean;
    priority?: number;
    position?: number;
    featured?: boolean;
  };
  highlight?: boolean;
  hiddenInSidebar?: boolean;
}
