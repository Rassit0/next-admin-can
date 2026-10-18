import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";

export interface TransactionDateResolution {
  /** Fecha en formato ISO 8601 UTC */
  dateISO: string;
  /** Indica si la fecha seleccionada corresponde a un día en el futuro según la zona horaria local */
  isFuture: boolean;
}

/**
 * Resuelve la fecha y hora para transacciones financieras asegurando la hora real:
 * - Si la fecha seleccionada corresponde al día de HOY en la zona horaria local:
 *   Retorna la fecha y hora exacta actual en UTC (`new Date().toISOString()`) capturada
 *   al momento de la confirmación.
 * - Si corresponde a un DÍA ANTERIOR:
 *   Retorna el inicio de ese día en zona horaria local en UTC (`date.toDate(getLocalTimeZone()).toISOString()`).
 * - Si corresponde a un DÍA FUTURO:
 *   Marca `isFuture: true` para bloquear el envío.
 * - Si no se especifica fecha (null / undefined):
 *   Retorna la fecha y hora actual en UTC por defecto.
 */
export function resolveTransactionDate(
  date: DateValue | null | undefined,
): TransactionDateResolution {
  if (!date) {
    return {
      dateISO: new Date().toISOString(),
      isFuture: false,
    };
  }

  const comparison = date.compare(today(getLocalTimeZone()));

  if (comparison > 0) {
    return {
      dateISO: "",
      isFuture: true,
    };
  }

  if (comparison === 0) {
    return {
      dateISO: new Date().toISOString(),
      isFuture: false,
    };
  }

  return {
    dateISO: date.toDate(getLocalTimeZone()).toISOString(),
    isFuture: false,
  };
}
