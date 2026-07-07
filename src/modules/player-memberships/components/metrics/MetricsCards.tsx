"use client";
import { Card, ProgressBar } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  CheckmarkBadge01Icon,
  PauseIcon,
  Coins01Icon,
  Ticket01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPlayerMembership } from "@/modules/player-memberships";
import {
  calculateInitialCharges,
  formatCurrency,
} from "@/modules/player-memberships/helpers/initial-charges";

interface Props {
  memberships: IPlayerMembership[];
  teamSeason: ITeamSeason;
  totalItems: number;
}

export const MetricsCards = ({
  memberships,
  teamSeason,
  totalItems,
}: Props) => {
  const active = memberships.filter((m) => m.status === "ACTIVE");
  const suspended = memberships.filter((m) => m.status === "SUSPENDED");

  const estimatedRevenue = active.reduce(
    (acc, m) => acc + calculateInitialCharges(teamSeason, m.paymentPlan).total,
    0,
  );

  const occupancy =
    teamSeason.maxMembers > 0
      ? Math.min(100, Math.round((totalItems / teamSeason.maxMembers) * 100))
      : 0;

  const cards = [
    {
      label: "Atletas inscritos",
      value: String(totalItems),
      hint: `${teamSeason.maxMembers} cupos · mín. ${teamSeason.minMembers}`,
      icon: UserGroupIcon,
      tone: "text-accent",
      bg: "bg-accent-soft",
      progress: occupancy,
    },
    {
      label: "Membresías activas",
      value: String(active.length),
      hint: "En curso esta temporada",
      icon: CheckmarkBadge01Icon,
      tone: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Suspendidas",
      value: String(suspended.length),
      hint: "Requieren seguimiento",
      icon: PauseIcon,
      tone: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Inscripción (Bs)",
      value: String(Number(teamSeason.registrationFee)),
      hint: "Tarifa única de ingreso",
      icon: Ticket01Icon,
      tone: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Mensualidad (Bs)",
      value: String(Number(teamSeason.recurringFee)),
      hint: "Cargo recurrente base",
      icon: Calendar01Icon,
      tone: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Recaudación inicial est.",
      value: formatCurrency(estimatedRevenue, "Bs"),
      hint: "Cargos iniciales activos",
      icon: Coins01Icon,
      tone: "text-accent",
      bg: "bg-accent-soft",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
          className="h-full"
        >
          <Card className="card-hover h-full p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {card.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                  {card.value}
                </p>
              </div>
              <span
                className={`shrink-0 flex size-12 items-center justify-center rounded-lg ${card.bg} ${card.tone} shadow-sm`}
              >
                <HugeiconsIcon icon={card.icon} size={22} />
              </span>
            </div>
            {typeof card.progress === "number" ? (
              <div className="mt-4">
                <ProgressBar value={card.progress} className="w-full">
                  <ProgressBar.Track className="bg-surface-secondary">
                    <ProgressBar.Fill />
                  </ProgressBar.Track>
                </ProgressBar>
                <p className="mt-2 text-xs font-medium text-muted">
                  {card.progress}% ocupación
                </p>
              </div>
            ) : (
              <p className="mt-4 text-xs text-muted">{card.hint}</p>
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
