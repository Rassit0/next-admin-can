import { PlayerMembershipStatus } from "@/modules/player-memberships";

type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

interface StatusConfig {
  label: string;
  color: ChipColor;
  dot: string;
}

export const MEMBERSHIP_STATUS_CONFIG: Record<
  PlayerMembershipStatus,
  StatusConfig
> = {
  PENDING_ACTIVE: {
    label: "Pendiente de activación",
    color: "accent",
    dot: "bg-accent",
  },
  ACTIVE: { label: "Activa", color: "success", dot: "bg-success" },
  SUSPENDED: { label: "Suspendida", color: "warning", dot: "bg-warning" },
  WITHDRAWN: { label: "Dado de baja", color: "danger", dot: "bg-danger" },
  FINISHED: { label: "Finalizada", color: "default", dot: "bg-muted" },
};

export const getStatusConfig = (status: PlayerMembershipStatus): StatusConfig =>
  MEMBERSHIP_STATUS_CONFIG[status] ?? MEMBERSHIP_STATUS_CONFIG.FINISHED;
