export type ChargeOriginKey = "MEMBERSHIP" | "STUDENT" | "ACCOUNT" | "OTHER";

export interface ChargeOriginConfig {
  origin: ChargeOriginKey;
  label: string;
  iconClass: string;
  badgeClass: string;
  accentBorderClass: string;
  cardTintClass: string;
  headerIconBoxClass: string;
  seasonIconClass: string;
}

const CHARGE_ORIGIN_MAP: Record<ChargeOriginKey, ChargeOriginConfig> = {
  MEMBERSHIP: {
    origin: "MEMBERSHIP",
    label: "Equipo",
    iconClass: "ri-group-line",
    badgeClass:
      "bg-blue-500/10 text-blue-700 border-blue-500/20 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/25",
    accentBorderClass: "border-l-[3px] border-l-blue-500 dark:border-l-blue-400",
    cardTintClass: "bg-blue-500/[0.025] dark:bg-blue-400/[0.04]",
    headerIconBoxClass:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-400/15 dark:text-blue-300 dark:border-blue-400/25",
    seasonIconClass: "text-blue-600 dark:text-blue-400",
  },
  STUDENT: {
    origin: "STUDENT",
    label: "Curso",
    iconClass: "ri-book-read-line",
    badgeClass:
      "bg-violet-500/10 text-violet-700 border-violet-500/20 dark:bg-violet-400/15 dark:text-violet-300 dark:border-violet-400/25",
    accentBorderClass:
      "border-l-[3px] border-l-violet-500 dark:border-l-violet-400",
    cardTintClass: "bg-violet-500/[0.025] dark:bg-violet-400/[0.04]",
    headerIconBoxClass:
      "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:bg-violet-400/15 dark:text-violet-300 dark:border-violet-400/25",
    seasonIconClass: "text-violet-600 dark:text-violet-400",
  },
  ACCOUNT: {
    origin: "ACCOUNT",
    label: "Cargo directo",
    iconClass: "ri-file-list-3-line",
    badgeClass:
      "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
    accentBorderClass:
      "border-l-[3px] border-l-slate-400/80 dark:border-l-slate-500/80",
    cardTintClass: "",
    headerIconBoxClass:
      "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
    seasonIconClass: "text-muted",
  },
  OTHER: {
    origin: "OTHER",
    label: "Cargo",
    iconClass: "ri-bill-line",
    badgeClass:
      "bg-slate-500/10 text-slate-700 border-slate-500/20 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
    accentBorderClass:
      "border-l-[3px] border-l-slate-400/80 dark:border-l-slate-500/80",
    cardTintClass: "",
    headerIconBoxClass:
      "bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-400/15 dark:text-slate-300 dark:border-slate-400/25",
    seasonIconClass: "text-muted",
  },
};

/**
 * Resolves the visual identity tokens for a charge or membership exclusively
 * from its explicit origin discriminator (`MEMBERSHIP`, `STUDENT`, `ACCOUNT`).
 */
export function getChargeOriginConfig(
  type?: string | null,
): ChargeOriginConfig {
  switch (type) {
    case "MEMBERSHIP":
      return CHARGE_ORIGIN_MAP.MEMBERSHIP;
    case "STUDENT":
      return CHARGE_ORIGIN_MAP.STUDENT;
    case "ACCOUNT":
      return CHARGE_ORIGIN_MAP.ACCOUNT;
    default:
      return CHARGE_ORIGIN_MAP.OTHER;
  }
}

/**
 * Checks whether a charge corresponds to a late fee using its structured relation
 * items (`membershipCharges` / `studentCharges`) instead of string matching.
 */
export function isLateFeeCharge(charge: {
  membershipCharges?: Array<{ type?: string }>;
  studentCharges?: Array<{ type?: string }>;
}): boolean {
  return (
    charge.membershipCharges?.[0]?.type === "LATE_FEE" ||
    charge.studentCharges?.[0]?.type === "LATE_FEE"
  );
}

/**
 * Determines whether the original amount should be rendered with strikethrough
 * (only when the pending balance is strictly lower than the original amount).
 */
export function shouldShowOriginalAmountStrikethrough(charge: {
  amount: number;
  pendingAmount: number;
}): boolean {
  const amount = Number(charge.amount || 0);
  const pendingAmount = Number(charge.pendingAmount || 0);
  return amount > 0 && pendingAmount < amount;
}

