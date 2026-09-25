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
    studentMembershipId: string;
  }>;
}

export default async function StudentMembershipInfoPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { studentMembershipId } = await params;

  const [membershipRes] = await resolvePageData([
    getStudentMembershipById({ id: studentMembershipId }),
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
                {membership.student?.person.name}{" "}
                {membership.student?.person.lastName}{" "}
                {membership.student?.person.secondLastName || ""}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Documento
                </p>
                <p className="font-semibold text-foreground">
                  {membership.student?.person.documentType}:{" "}
                  {membership.student?.person.documentNumber}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Teléfono
                </p>
                <p className="font-semibold text-foreground">
                  {membership.student?.person.phone || "No registrado"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Correo Electrónico
              </p>
              <p className="font-semibold text-foreground">
                {membership.student?.person.email || "No registrado"}
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
import {
  getStudentMembershipById,
  StatusChip,
} from "@/modules/student-memberships";
