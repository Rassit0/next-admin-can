"use client";
import { Chip } from "@heroui/react";
import { PaymentStatus } from "@/modules/payments/interfaces/payment.interface";
import { getPaymentStatusConfig } from "@/modules/payments/constants/status";

interface Props {
  status: PaymentStatus;
  size?: "sm" | "md" | "lg";
}

export const PaymentStatusChip = ({ status, size = "sm" }: Props) => {
  const config = getPaymentStatusConfig(status);
  return (
    <Chip color={config.color} variant="soft" size={size}>
      <span className={`size-1.5 rounded-full ${config.dot}`} aria-hidden />
      <Chip.Label>{config.label}</Chip.Label>
    </Chip>
  );
};
