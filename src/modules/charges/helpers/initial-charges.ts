import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";

export interface ChargeLine {
  key: "registration" | "monthly";
  label: string;
  description: string;
  gross: number;
  discountPercent: number;
  discountAmount: number;
  net: number;
}

export interface InitialChargesBreakdown {
  lines: ChargeLine[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  currency: string;
  flags: ChargeFlag[];
}

export interface ChargeFlag {
  type: "info" | "warning" | "success";
  label: string;
}

const toNumber = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const parsed = typeof value === "number" ? value : Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

/**
 * Computes the initial charges generated when a player is enrolled into a
 * TeamSeason. The base prices come 100% from the TeamSeason configuration
 * (registrationFee + recurringFee) and the discounts come from the selected
 * PaymentPlan. The first monthly fee is charged up-front together with the
 * registration fee.
 */
export const calculateInitialCharges = (
  teamSeason: Pick<
    ITeamSeason,
    "registrationFee" | "recurringFee" | "lateFeeEnabled" | "billingDay"
  >,
  paymentPlan?: Pick<
    IPaymentPlan,
    "registrationDiscountPercent" | "recurringDiscountPercent"
  > | null,
  currency = "Bs",
): InitialChargesBreakdown => {
  const registrationGross = toNumber(teamSeason.registrationFee);
  const monthlyGross = toNumber(teamSeason.recurringFee);

  const registrationDiscountPercent = paymentPlan
    ? toNumber(paymentPlan.registrationDiscountPercent)
    : 0;
  const recurringDiscountPercent = paymentPlan
    ? toNumber(paymentPlan.recurringDiscountPercent)
    : 0;

  const registrationDiscount = round2(
    registrationGross * (registrationDiscountPercent / 100),
  );
  const monthlyDiscount = round2(monthlyGross * (recurringDiscountPercent / 100));

  const registrationNet = round2(registrationGross - registrationDiscount);
  const monthlyNet = round2(monthlyGross - monthlyDiscount);

  const lines: ChargeLine[] = [
    {
      key: "registration",
      label: "Matrícula de inscripción",
      description: "Cargo único al momento de la inscripción",
      gross: registrationGross,
      discountPercent: registrationDiscountPercent,
      discountAmount: registrationDiscount,
      net: registrationNet,
    },
    {
      key: "monthly",
      label: "Primera mensualidad",
      description: "Cuota correspondiente al primer mes",
      gross: monthlyGross,
      discountPercent: recurringDiscountPercent,
      discountAmount: monthlyDiscount,
      net: monthlyNet,
    },
  ];

  const subtotal = round2(registrationGross + monthlyGross);
  const totalDiscount = round2(registrationDiscount + monthlyDiscount);
  const total = round2(registrationNet + monthlyNet);

  const flags: ChargeFlag[] = [];
  if (registrationDiscountPercent > 0 || recurringDiscountPercent > 0) {
    flags.push({
      type: "success",
      label: "Plan con descuentos aplicados",
    });
  }
  if (registrationGross === 0) {
    flags.push({ type: "info", label: "Temporada sin matrícula" });
  }
  if (teamSeason.lateFeeEnabled) {
    flags.push({
      type: "warning",
      label: "Aplica recargo por mora en pagos tardíos",
    });
  }

  return {
    lines,
    subtotal,
    totalDiscount,
    total,
    currency,
    flags,
  };
};

export const formatCurrency = (value: number, currency = "Bs"): string => {
  return `${currency} ${value.toLocaleString("es-BO", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
