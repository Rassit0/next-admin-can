import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getPlayers } from "@/modules/players";
import { getTeamSeasonById } from "@/modules/team-seasons";
import {
  EnrollMembershipDrawer,
  getPlayerMembershipById,
  getPlayerMemberships,
  MetricsCards,
  TableMemberships,
  StatusChip,
  getTeamSeasonContext,
} from "@/modules/player-memberships";
import { Button, Card, Alert, Chip, Tabs } from "@heroui/react";
import {
  Wallet01Icon,
  UserCircleIcon,
  File02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCharges, TableCharges } from "@/modules/charge-transactions";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: string;
  }>;
  params: Promise<{
    playerMembershipId: string;
  }>;
}

export default async function PlayerMembershipInfoPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page = "5", status } = await searchParams;
  const { playerMembershipId } = await params;

  const [membershipRes] = await resolvePageData([
    getPlayerMembershipById({ id: playerMembershipId }),
  ]);
  const membership = membershipRes.data;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 shadow-sm border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <HugeiconsIcon icon={UserCircleIcon} className="text-primary" />
            Datos Personales del Jugador
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Nombre Completo
              </p>
              <p className="font-semibold text-foreground text-md">
                {membership.player?.person.name}{" "}
                {membership.player?.person.lastName}{" "}
                {membership.player?.person.secondLastName || ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Documento
                </p>
                <p className="font-semibold text-foreground">
                  {membership.player?.person.documentType}:{" "}
                  {membership.player?.person.documentNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>
                <p className="font-semibold text-foreground">
                  {membership.player?.person.phone || "No registrado"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Correo Electrónico
              </p>
              <p className="font-semibold text-foreground">
                {membership.player?.person.email || "No registrado"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-5 shadow-sm border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <HugeiconsIcon icon={File02Icon} className="text-primary" />
            Detalles de la Membresía
          </h3>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Plan de Pago
                </p>
                <p className="font-semibold text-foreground">
                  {membership.paymentPlan?.name || "Sin Plan"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Estado Actual
                </p>
                <StatusChip status={membership.status} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha de Inicio
                </p>
                <p className="font-semibold text-foreground">
                  {new Date(membership.startedAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fecha de Fin
                </p>
                <p className="font-semibold text-foreground">
                  {membership.finishedAt
                    ? new Date(membership.finishedAt).toLocaleDateString()
                    : "Indefinido"}
                </p>
              </div>
            </div>
            {membership.totalPendingAmount > 0 && (
              <div className="mt-2 p-3 bg-danger-50 text-danger-600 rounded-lg">
                <p className="text-sm font-semibold">Deuda Total Pendiente</p>
                <p className="text-xl font-bold">
                  {membership.totalPendingAmount} Bs
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

import { resolvePageData } from "@/utils/resolvePageData";
