import { ITeamSeason } from "@/modules/team-seasons";
import { ICourseSeason } from "@/modules/course-seasons";
import { IPlayerMembership } from "@/modules/player-memberships";
import { IStudentMembership } from "@/modules/student-memberships";
import { calculateInitialCharges } from "@/modules/player-memberships";
import {
  IPayment,
  PaymentInput,
  PaymentResult,
} from "@/modules/payments/interfaces/payment.interface";

const fullName = (membership: any): string => {
  const person = (membership.player?.person || membership.student?.person);
  if (!person) return "Atleta";
  return [person.name, person.lastName, person.secondLastName]
    .filter(Boolean)
    .join(" ");
};

/**
 * Derives the initial payment ledger for a TeamSeason. Every membership
 * generates two charge concepts (registration + first monthly fee) coming
 * straight from the TeamSeason pricing configuration. Active memberships
 * start as PAID (already collected at enrollment) while suspended/withdrawn
 * memberships keep an outstanding PENDING balance.
 */
export const buildPaymentLedger = (
  memberships: any[],
  season: any,
): IPayment[] => {
  const ledger: IPayment[] = [];

  memberships.forEach((membership) => {
    const breakdown = calculateInitialCharges(
      season,
      membership.paymentPlan,
    );
    const collected = membership.status === "ACTIVE";

    breakdown.lines.forEach((line) => {
      if (line.net <= 0) return;
      ledger.push({
        id: `${membership.id}-${line.key}`,
        membershipId: membership.id,
        athleteName: fullName(membership),
        athleteImageUrl: (membership.player?.person || membership.student?.person).imageUrl ?? null,
        concept: line.label,
        amount: line.net,
        currency: breakdown.currency,
        status: collected ? "PAID" : "PENDING",
        method: collected ? "CARD" : null,
        reference: collected ? generateReference() : null,
        dueDate: membership.startedAt,
        paidAt: collected ? membership.startedAt : null,
      });
    });
  });

  return ledger;
};

export const generateReference = (): string => {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `PAY-${stamp}${rand}`;
};

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

export const luhnValid = (cardNumber: string): boolean => {
  const digits = onlyDigits(cardNumber);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number.parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
};

export const validatePaymentInput = (
  input: PaymentInput,
): { valid: boolean; error?: string } => {
  if (input.method === "CARD") {
    if (!input.cardholder.trim())
      return { valid: false, error: "Ingresa el nombre del titular." };
    if (!luhnValid(input.cardNumber))
      return { valid: false, error: "El número de tarjeta no es válido." };
    if (!/^\d{2}\/\d{2}$/.test(input.expiry))
      return { valid: false, error: "La fecha debe tener el formato MM/AA." };
    if (!/^\d{3,4}$/.test(input.cvc))
      return { valid: false, error: "El CVC no es válido." };
    return { valid: true };
  }
  if (!input.bank.trim())
    return { valid: false, error: "Selecciona el banco emisor." };
  if (input.reference.trim().length < 4)
    return { valid: false, error: "Ingresa una referencia de transferencia." };
  return { valid: true };
};

/**
 * Simulates a payment gateway round-trip. Validates the input, waits to
 * emulate network latency and resolves with a success/failure result. Cards
 * ending in an even digit succeed; this keeps the simulation deterministic
 * for demos while still exercising the error path.
 */
export const processPayment = (input: PaymentInput): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    const validation = validatePaymentInput(input);
    if (!validation.valid) {
      resolve({
        success: false,
        reference: "",
        message: validation.error ?? "Datos de pago inválidos.",
      });
      return;
    }

    setTimeout(() => {
      let success = true;
      if (input.method === "CARD") {
        const digits = onlyDigits(input.cardNumber);
        const last = Number.parseInt(digits[digits.length - 1] ?? "0", 10);
        success = last % 2 === 0;
      }
      resolve({
        success,
        reference: success ? generateReference() : "",
        message: success
          ? "Pago procesado exitosamente."
          : "El emisor rechazó la transacción. Verifica los datos o usa otro método.",
      });
    }, 1400);
  });
};
