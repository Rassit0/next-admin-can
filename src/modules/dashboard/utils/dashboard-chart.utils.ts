import { IDashboardFinancialFlowPoint } from "../interfaces/dashboard.interface";

const MONTH_NAMES_ES: Record<string, string> = {
  "01": "ene",
  "02": "feb",
  "03": "mar",
  "04": "abr",
  "05": "may",
  "06": "jun",
  "07": "jul",
  "08": "ago",
  "09": "sep",
  "10": "oct",
  "11": "nov",
  "12": "dic",
};

/**
 * Formatea el bucket de fecha sin utilizar `new Date()` ni depender
 * de la zona horaria del navegador, preservando el día local decidido por PostgreSQL.
 * - '2026-10-15' -> '15 oct'
 * - '2026-10'    -> 'oct 26'
 */
export function formatChartBucket(bucketStr: string): string {
  if (!bucketStr || typeof bucketStr !== "string") return "";

  const clean = bucketStr.trim();
  const parts = clean.split("-");

  // Caso YYYY-MM-DD
  if (parts.length === 3) {
    const day = parseInt(parts[2], 10);
    const month = MONTH_NAMES_ES[parts[1]] || parts[1];
    return `${day} ${month}`;
  }

  // Caso YYYY-MM
  if (parts.length === 2) {
    const month = MONTH_NAMES_ES[parts[1]] || parts[1];
    const yearShort = parts[0].slice(2);
    return `${month} '${yearShort}`;
  }

  return clean;
}

/**
 * Formatea montos para el eje Y de Recharts de manera compacta (ej. 10k, 50k, 1.2M)
 */
export function formatCompactCurrency(value: number): string {
  if (value === 0 || isNaN(value)) return "0";

  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000) {
    const formatted = (abs / 1_000_000).toFixed(1).replace(/\.0$/, "");
    return `${sign}${formatted}M`;
  }

  if (abs >= 1_000) {
    const formatted = (abs / 1_000).toFixed(abs >= 10_000 ? 0 : 1).replace(/\.0$/, "");
    return `${sign}${formatted}k`;
  }

  return `${sign}${abs}`;
}

/**
 * Verifica si una serie de flujo financiero no tiene movimientos reales
 */
export function isFinancialDatasetEmpty(
  series?: IDashboardFinancialFlowPoint[],
): boolean {
  if (!series || series.length === 0) return true;
  return series.every((point) => point.income === 0 && point.expense === 0);
}
