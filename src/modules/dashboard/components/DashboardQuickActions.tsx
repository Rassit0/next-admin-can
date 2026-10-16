"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Invoice02Icon,
  UserAdd01Icon,
  TransactionIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons";

interface DashboardQuickActionsProps {
  permissions: string[];
}

interface QuickActionConfig {
  id: string;
  label: string;
  href: string;
  permission: string;
  icon: any;
}

const AVAILABLE_ACTIONS: QuickActionConfig[] = [
  {
    id: "payment",
    label: "Registrar Pago / Cobro",
    href: "/admin/quick-operations",
    permission: "CREATE_TRANSACTIONS",
    icon: Wallet02Icon,
  },
  {
    id: "enrollment",
    label: "Nueva Inscripción",
    href: "/admin/memberships/student-memberships",
    permission: "CREATE_STUDENT_MEMBERSHIPS",
    icon: UserAdd01Icon,
  },
  {
    id: "transfer",
    label: "Transferencia Interna",
    href: "/admin/accounting/transfers",
    permission: "CREATE_INTERNAL_TRANSFERS",
    icon: TransactionIcon,
  },
  {
    id: "charge",
    label: "Gestionar Cargos",
    href: "/admin/student-charges",
    permission: "CREATE_STUDENT_CHARGES",
    icon: Invoice02Icon,
  },
];

export const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({
  permissions = [],
}) => {
  const router = useRouter();

  // Filtro estricto por permisos reales de RolePermission (sin roles ni bypasses)
  const allowedActions = AVAILABLE_ACTIONS.filter((action) =>
    permissions.includes(action.permission),
  );

  if (allowedActions.length === 0) return null;

  return (
    <Dropdown>
      <Button
        variant="primary"
        size="sm"
        className="flex items-center gap-1.5 px-3 h-9 font-semibold text-xs rounded-xl"
        aria-label="Acciones rápidas del sistema"
      >
        <HugeiconsIcon icon={Add01Icon} size={16} />
        <span className="hidden sm:inline">Acciones</span>
      </Button>

      <Dropdown.Popover className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl min-w-[200px] p-1">
        <Dropdown.Menu
          onAction={(key) => {
            const action = allowedActions.find((a) => a.id === key);
            if (action) {
              router.push(action.href);
            }
          }}
        >
          {allowedActions.map((action) => (
            <Dropdown.Item
              key={action.id}
              id={action.id}
              textValue={action.label}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <HugeiconsIcon icon={action.icon} size={16} className="text-slate-500" />
              <span>{action.label}</span>
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
};
