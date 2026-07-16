"use client";
import { Card, ProgressBar, Popover, Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserGroupIcon,
  CheckmarkBadge01Icon,
  PauseIcon,
  Coins01Icon,
  Ticket01Icon,
  Calendar01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { motion } from "framer-motion";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPlayerMembership } from "@/modules/player-memberships";
import {
  calculateInitialCharges,
  formatCurrency,
} from "@/modules/player-memberships/helpers/initial-charges";

interface Props {
  teamSeason: ITeamSeason;
  totalItems: number;
  globalTotalPending?: number;
  globalTotalPaid?: number;
  activeMembers?: number;
  suspendedMembers?: number;
  pendingMembers?: number;
  totalBilled?: number;
}

const InfoTooltip = ({ text }: { text: string }) => (
  <Popover>
    <Button
      isIconOnly
      variant="ghost"
      size="sm"
      className="h-4 w-4 min-w-4 text-muted-foreground ml-1 p-0"
    >
      <HugeiconsIcon icon={InformationCircleIcon} size={14} />
    </Button>
    <Popover.Content placement="top">
      <Popover.Dialog className="max-w-50 px-3 py-2">
        <Popover.Arrow />
        <p className="text-xs font-normal normal-case tracking-normal text-foreground">
          {text}
        </p>
      </Popover.Dialog>
    </Popover.Content>
  </Popover>
);

export const MetricsCards = ({
  teamSeason,
  totalItems,
  globalTotalPending = 0,
  globalTotalPaid = 0,
  activeMembers = 0,
  suspendedMembers = 0,
  pendingMembers = 0,
  totalBilled = 0,
}: Props) => {
  const occupancy =
    teamSeason.maxMembers > 0
      ? Math.min(100, Math.round((totalItems / teamSeason.maxMembers) * 100))
      : 0;

  const cards = [
    {
      label: "Atletas inscritos",
      value: String(totalItems),
      hint: `Total de atletas registrados en esta temporada. Capacidad configurada: entre ${teamSeason.minMembers} y ${teamSeason.maxMembers} cupos.`,
      icon: UserGroupIcon,
      tone: "text-accent",
      bg: "bg-accent-soft",
      progress: occupancy,
    },
    {
      label: "Membresías activas",
      value: String(activeMembers),
      hint: "Número de atletas que se encuentran cursando activamente la temporada. No incluye suspendidos.",
      icon: CheckmarkBadge01Icon,
      tone: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Suspendidas",
      value: String(suspendedMembers),
      hint: "Atletas cuya membresía ha sido suspendida (ej. por retiro temporal o falta de pago).",
      icon: PauseIcon,
      tone: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Pendientes",
      value: String(pendingMembers),
      hint: "Atletas recién inscritos cuya membresía está a la espera del pago inicial para activarse.",
      icon: PauseIcon,
      tone: "text-muted-foreground",
      bg: "bg-surface-secondary",
    },
    {
      label: "Inscripción (Bs)",
      value: String(Number(teamSeason.billingConfig?.registrationFee)),
      hint: "Costo fijo único de matrícula establecido para ingresar a esta temporada.",
      icon: Ticket01Icon,
      tone: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Mensualidad (Bs)",
      value: String(Number(teamSeason.billingConfig?.recurringFee)),
      hint: "Costo base recurrente (por mes) configurado para la temporada (sin contar descuentos).",
      icon: Calendar01Icon,
      tone: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      label: "Total Facturado",
      value: formatCurrency(totalBilled, "Bs"),
      hint: "Suma de todos los cargos que se han generado en el sistema para esta temporada (incluyendo inscripciones, mensualidades y cualquier cargo extra o multa).",
      icon: Coins01Icon,
      tone: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Total Recaudado",
      value: formatCurrency(globalTotalPaid, "Bs"),
      hint: "Dinero real que ya ha sido pagado y completado exitosamente en el sistema para esta temporada.",
      icon: CheckmarkBadge01Icon,
      tone: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Total Pendiente",
      value: formatCurrency(globalTotalPending, "Bs"),
      hint: "Suma de todos los cargos generados en esta temporada que aún se encuentran pendientes de cobro.",
      icon: Coins01Icon,
      tone: "text-warning",
      bg: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                <p className="text-xs font-semibold uppercase tracking-wide text-muted flex items-center">
                  {card.label}
                  {card.hint && <InfoTooltip text={card.hint} />}
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
            {typeof card.progress === "number" && (
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
            )}
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
