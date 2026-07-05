"use client";

import { Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PaymentStatus } from "@/modules/pagos/types";
import { PAYMENT_STATUS_CONFIG } from "@/modules/pagos/constants";

interface PaymentStatusChipProps {
  status: PaymentStatus;
  size?: "sm" | "md" | "lg";
}

export const PaymentStatusChip = ({
  status,
  size = "md",
}: PaymentStatusChipProps) => {
  const config = PAYMENT_STATUS_CONFIG[status];

  return (
    <Chip
      className={config.bgColor}
      color={config.color}
      size={size}
      // variant="flat"
    >
      <HugeiconsIcon icon={config.icon} size={size === "sm" ? 14 : 16} />
      <span className={`text-${size === "sm" ? "xs" : "sm"} font-semibold`}>
        {config.label}
      </span>
    </Chip>
  );
};
