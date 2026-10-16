export type DashboardPeriodPreset =
  | "this-month"
  | "last-month"
  | "last-7-days"
  | "this-year";

export interface DashboardPeriodOption {
  id: DashboardPeriodPreset;
  label: string;
}

export const DASHBOARD_PERIOD_OPTIONS: DashboardPeriodOption[] = [
  { id: "this-month", label: "Este mes" },
  { id: "last-month", label: "Mes anterior" },
  { id: "last-7-days", label: "Últimos 7 días" },
  { id: "this-year", label: "Este año" },
];

export interface PeriodDates {
  from?: string;
  to?: string;
}

/**
 * Resuelve las fechas de consulta a partir del preset o fechas personalizadas.
 * Para 'this-month' devuelve vacío para permitir que el backend aplique su cálculo
 * canónico de límites de mes en envs.appTimezone.
 */
export function resolvePeriodDates(
  preset?: string,
  customFrom?: string,
  customTo?: string,
): PeriodDates {
  if (customFrom && customTo) {
    return { from: customFrom, to: customTo };
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  switch (preset) {
    case "last-month": {
      // Mes anterior calendario
      const prevMonthDate = new Date(currentYear, currentMonth - 1, 1);
      const y = prevMonthDate.getFullYear();
      const m = prevMonthDate.getMonth();
      const firstDay = new Date(Date.UTC(y, m, 1, 0, 0, 0, 0));
      // Día 0 del mes siguiente es el último día del mes m
      const lastDay = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
      return {
        from: firstDay.toISOString(),
        to: lastDay.toISOString(),
      };
    }

    case "last-7-days": {
      const start = new Date(now);
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      return {
        from: start.toISOString(),
        to: end.toISOString(),
      };
    }

    case "this-year": {
      const firstDay = new Date(Date.UTC(currentYear, 0, 1, 0, 0, 0, 0));
      const lastDay = new Date(Date.UTC(currentYear, 11, 31, 23, 59, 59, 999));
      return {
        from: firstDay.toISOString(),
        to: lastDay.toISOString(),
      };
    }

    case "this-month":
    default:
      // Omitir para que el backend aplique automáticamente el mes en curso en appTimezone
      return {};
  }
}

/**
 * Formatea enteros según localización es-BO (separador de miles con punto)
 */
export function formatNumber(value: number): string {
  if (isNaN(value)) return "0";
  return new Intl.NumberFormat("es-BO").format(value);
}
