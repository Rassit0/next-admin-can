import { CheckmarkCircle01Icon, AlertCircleIcon, PauseCircleIcon, Logout01Icon } from "@hugeicons/core-free-icons";

export const ASSIGNMENT_STATUS_CONFIG = {
  active: {
    label: "Activo",
    icon: CheckmarkCircle01Icon,
    color: "success",
    bgColor: "bg-success/10",
    textColor: "text-success",
  },
  suspended: {
    label: "Suspendido",
    icon: PauseCircleIcon,
    color: "warning",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
  },
  completed: {
    label: "Completado",
    icon: CheckmarkCircle01Icon,
    color: "default",
    bgColor: "bg-default/10",
    textColor: "text-default-foreground",
  },
  withdrawn: {
    label: "Retirado",
    icon: Logout01Icon,
    color: "danger",
    bgColor: "bg-danger/10",
    textColor: "text-danger",
  },
} as const;

export const ASSIGNMENT_STATUS_ACTIONS: Record<string, string[]> = {
  active: ["suspend", "complete", "withdraw"],
  suspended: ["reactivate", "withdraw"],
  completed: [],
  withdrawn: [],
};
