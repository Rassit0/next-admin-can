import {
  PaymentSuccess01Icon,
  MoneyExchange01Icon,
  UserAdd02Icon,
  PropertyEditIcon,
  Calendar02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { formatCurrency } from "@/utils/constants";
import {
  DashboardActivityActionType,
  IDashboardActivityUser,
  IDashboardActivityContext,
} from "../interfaces/dashboard.interface";
import { formatNumber } from "./dashboard-period";

export interface ActivityPresentation {
  icon: any;
  label: string;
  iconBgClass: string;
  iconColorClass: string;
  badgeClass: string;
}

export function getActivityPresentation(
  actionType: DashboardActivityActionType,
): ActivityPresentation {
  switch (actionType) {
    case "PAYMENT":
      return {
        icon: PaymentSuccess01Icon,
        label: "Cobro / Pago",
        iconBgClass: "bg-emerald-500/10",
        iconColorClass: "text-emerald-600 dark:text-emerald-400",
        badgeClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
      };

    case "INTERNAL_TRANSFER":
      return {
        icon: MoneyExchange01Icon,
        label: "Transferencia",
        iconBgClass: "bg-sky-500/10",
        iconColorClass: "text-sky-600 dark:text-sky-400",
        badgeClass: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300",
      };

    case "ENROLLMENT":
      return {
        icon: UserAdd02Icon,
        label: "Inscripción",
        iconBgClass: "bg-purple-500/10",
        iconColorClass: "text-purple-600 dark:text-purple-400",
        badgeClass: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300",
      };

    case "MEMBERSHIP_STATUS":
      return {
        icon: PropertyEditIcon,
        label: "Membresía",
        iconBgClass: "bg-amber-500/10",
        iconColorClass: "text-amber-600 dark:text-amber-400",
        badgeClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
      };

    case "SHIFT_OCCUPANCY":
      return {
        icon: Calendar02Icon,
        label: "Turno",
        iconBgClass: "bg-blue-500/10",
        iconColorClass: "text-blue-600 dark:text-blue-400",
        badgeClass: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
      };

    case "SYSTEM":
    default:
      return {
        icon: Settings02Icon,
        label: "Sistema",
        iconBgClass: "bg-slate-500/10",
        iconColorClass: "text-slate-600 dark:text-slate-400",
        badgeClass: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      };
  }
}

/**
 * Retorna el nombre presentable del actor (o 'Sistema' si es null)
 */
export function getActivityUserDisplayName(
  user: IDashboardActivityUser | null,
): string {
  if (!user || !user.displayName || user.displayName.trim() === "") {
    return "Sistema";
  }
  return user.displayName.trim();
}

/**
 * Formatea el monto financiero si existe en el contexto respetando la moneda
 */
export function formatActivityAmount(
  context: IDashboardActivityContext,
): string | null {
  if (context.amount === undefined || context.amount === null) {
    return null;
  }

  const currency = context.currency || "BOB";
  if (currency === "BOB") {
    return formatCurrency(context.amount);
  }

  return `${currency} ${formatNumber(context.amount)}`;
}

/**
 * Formateador de tiempo relativo seguro para SSR (sin hydration mismatch)
 */
export function formatRelativeTime(
  isoDateString: string,
  currentTimestampMs?: number,
): string {
  const date = new Date(isoDateString);
  const now = currentTimestampMs !== undefined ? currentTimestampMs : Date.now();
  const diffInSeconds = Math.floor((now - date.getTime()) / 1000);

  if (isNaN(diffInSeconds) || diffInSeconds < 0) {
    return "Recién";
  }

  if (diffInSeconds < 60) {
    return "Hace un momento";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Hace ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Hace ${diffInHours} ${diffInHours === 1 ? "h" : "h"}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return "Ayer";
  }

  if (diffInDays < 7) {
    return `Hace ${diffInDays} días`;
  }

  return new Intl.DateTimeFormat("es-BO", {
    day: "numeric",
    month: "short",
  }).format(date);
}
