import { ReactNode } from "react";

// export type Action = 'read' | 'create' | 'update' | 'delete' | 'manage'
export type Action = string;

export interface NavItems {
  title?: string;
  items: NavItem[];
}

export interface NavItem {
  label: string;
  icon?: ReactNode;
  href: string; // obligatorio si no hay subMenu
  action: Action;
  subject: string | string[];
  children?: never; // no permitido

  mobile?: {
    visible?: boolean;
    priority?: number;
    position?: number;
    featured?: boolean;
  };
}
