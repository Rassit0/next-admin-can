"use client";
import { Chip } from "@heroui/react";
import { PlayerMembershipStatus } from "@/modules/player-memberships";
import { getStatusConfig } from "@/modules/player-memberships/constants/status";

interface Props {
  status: PlayerMembershipStatus;
  size?: "sm" | "md" | "lg";
}

export const StatusChip = ({ status, size = "sm" }: Props) => {
  const config = getStatusConfig(status);
  return (
    <Chip color={config.color} variant="soft" size={size}>
      <span className={`size-1.5 rounded-full ${config.dot}`} aria-hidden />
      <Chip.Label>{config.label}</Chip.Label>
    </Chip>
  );
};
