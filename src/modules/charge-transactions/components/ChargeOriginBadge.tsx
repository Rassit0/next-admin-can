"use client";

import { getChargeOriginConfig } from "../constants/charge-origin";

interface Props {
  type?: string | null;
  size?: "xs" | "sm";
  className?: string;
}

/**
 * Compact pill displaying the charge origin (`Equipo`, `Curso`, `Cargo directo`)
 * styled according to the shared `charge-origin` visual tokens.
 */
export const ChargeOriginBadge = ({
  type,
  size = "sm",
  className = "",
}: Props) => {
  const origin = getChargeOriginConfig(type);
  const sizeClasses =
    size === "xs"
      ? "text-[11px] px-1.5 py-0.5 gap-1"
      : "text-xs px-2 py-0.5 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shrink-0 leading-none ${sizeClasses} ${origin.badgeClass} ${className}`.trim()}
    >
      <i className={`${origin.iconClass} text-[11px] shrink-0`} aria-hidden />
      <span>{origin.label}</span>
    </span>
  );
};

