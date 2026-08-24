"use client";
import { Chip } from "@heroui/react";
import { StudentMembershipStatus, StudentMembershipSuspensionReason } from "@/modules/student-memberships";
import { getStatusConfig } from "@/modules/student-memberships/constants/status";

interface Props {
  status: StudentMembershipStatus;
  suspensionReason?: StudentMembershipSuspensionReason | null;
  size?: "sm" | "md" | "lg";
}

export const StatusChip = ({ status, suspensionReason, size = "sm" }: Props) => {
  const config = getStatusConfig(status, suspensionReason);
  return (
    <Chip color={config.color} variant="soft" size={size}>
      <span className={`size-1.5 rounded-full ${config.dot}`} aria-hidden />
      <Chip.Label>{config.label}</Chip.Label>
    </Chip>
  );
};
