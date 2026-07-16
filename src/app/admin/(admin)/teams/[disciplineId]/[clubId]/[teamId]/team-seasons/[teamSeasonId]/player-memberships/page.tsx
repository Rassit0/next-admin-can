import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPaymentPlans } from "@/modules/payment-plans";
import { getPlayers } from "@/modules/players";
import { getTeamSeasonById } from "@/modules/team-seasons";
import {
  EnrollMembershipDrawer,
  getPlayerMemberships,
  MetricsCards,
  TableMemberships,
} from "@/modules/player-memberships";
import { Button, Card, Alert, Chip, Popover } from "@heroui/react";
import {
  Wallet01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    status?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
  }>;
}

export default async function PlayerMembershipsPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { disciplineId, clubId, teamId, teamSeasonId } = await params;

  const [membershipsResponse, teamSeasonResponse, paymentPlansResponse] =
    await Promise.all([
      getPlayerMemberships({ search, page, per_page, teamSeasonId, status }),
      getTeamSeasonById({ id: teamSeasonId }),
      getPaymentPlans({ per_page: "100", teamSeasonId }),
    ]);

  if (membershipsResponse.error && membershipsResponse.statusCode === 401) {
    redirect("/login");
  }
  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }
  if (membershipsResponse.error) {
    return <ErrorPage message={membershipsResponse.message} />;
  }

  const teamSeason = teamSeasonResponse.data;
  const memberships = membershipsResponse.data.data;
  const meta = membershipsResponse.data.meta;
  const paymentPlans = paymentPlansResponse.error
    ? []
    : paymentPlansResponse.data.data;

  const GENDER_MAP: Record<string, string> = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  return (
    <>
      <HeaderPage
        title={`${teamSeason.category.name} (${GENDER_MAP[teamSeason.gender] || teamSeason.gender}) · ${teamSeason.season.name}`}
        description={`Equipo: ${teamSeason.team.name} · Gestiona las membresías de la temporada y sus cargos iniciales`}
        action={
          <>
            <Link
              href={`/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/payments`}
            >
              <Button variant="secondary">
                <HugeiconsIcon icon={Wallet01Icon} size={18} />
                Ver pagos
              </Button>
            </Link>
          </>
        }
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Temporadas`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: `Membresías`,
          },
        ]}
      />

      <div className="flex flex-col gap-6 page-content">
        <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border flex flex-col gap-5 bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg">
              Resumen Financiero y Reglas
            </h3>
            <div className="flex items-center gap-2">
              <Chip
                color={teamSeason.isRegistrationOpen ? "success" : "danger"}
                variant="soft"
                size="sm"
                className="font-semibold tracking-wide uppercase"
              >
                {teamSeason.isRegistrationOpen ? "Inscripciones Abiertas" : "Inscripciones Cerradas"}
              </Chip>
              <Chip
                color="accent"
                variant="soft"
                size="sm"
                className="font-semibold tracking-wide uppercase"
              >
                Género: {GENDER_MAP[teamSeason.gender] || teamSeason.gender}
              </Chip>
            </div>
          </div>
          <hr className="border-border" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                Modelo de Cobro
                <InfoTooltip text="Define si la temporada permite pagos fragmentados mes a mes, o si es un pago cerrado." />
              </p>
              <p className="font-bold text-sm">
                {teamSeason.billingConfig?.billingType === "MONTHLY_ONLY" && "Sólo Recurrente"}
                {teamSeason.billingConfig?.billingType === "SINGLE_ONLY" && "Sólo Pago Único"}
                {teamSeason.billingConfig?.billingType === "BOTH" && "Pago Único o Recurrente"}
              </p>
            </div>
            {teamSeason.billingConfig?.billingType !== "SINGLE_ONLY" && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                    Matrícula
                    <InfoTooltip text="Costo único que se cobra al inicio (o prorrateado) por ingresar al equipo en esta temporada." />
                  </p>
                  <p className="font-bold text-sm">
                    {teamSeason.billingConfig?.registrationFee
                      ? `${teamSeason.billingConfig?.registrationFee} Bs.`
                      : "Gratis"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                    Cuota Base (
                    {teamSeason.billingConfig?.billingFrequency === "WEEKLY"
                      ? "Semanal"
                      : teamSeason.billingConfig?.billingFrequency === "BIWEEKLY"
                        ? "Quincenal"
                        : "Mensual"}
                    )
                    <InfoTooltip text="Monto recurrente base que se cobrará periódicamente (antes de aplicar planes o descuentos)." />
                  </p>
                  <p className="font-bold text-sm">
                    {teamSeason.billingConfig?.recurringFee
                      ? `${teamSeason.billingConfig?.recurringFee} Bs.`
                      : "Gratis"}
                  </p>
                </div>
              </>
            )}
            {(teamSeason.billingConfig?.billingType === "SINGLE_ONLY" ||
              teamSeason.billingConfig?.billingType === "BOTH") && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold flex items-center">
                  Tarifa Temporada Completa
                  <InfoTooltip text="Costo de la temporada completa si el modelo permite o requiere Pago Único (esquema cerrado)." />
                </p>
                <p className="font-bold text-sm">
                  {teamSeason.billingConfig?.seasonFee
                    ? `${teamSeason.billingConfig?.seasonFee} Bs.`
                    : "Gratis"}
                </p>
              </div>
            )}
            <div className="col-span-full">
              <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold flex items-center">
                Opciones de Prorrateo Activas
                <InfoTooltip text="Si el jugador ingresa tarde (después de la fecha de inicio del ciclo), el sistema cobrará la fracción correspondiente matemáticamente a los días activos de las opciones que veas aquí marcadas." />
              </p>
              <div className="flex flex-wrap gap-2">
                {teamSeason.billingConfig?.prorateRegistrationFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Matrícula
                  </Chip>
                )}
                {teamSeason.billingConfig?.prorateFirstRecurringFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Primer Cargo Recurrente
                  </Chip>
                )}
                {teamSeason.billingConfig?.prorateLastRecurringFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Último Cargo Recurrente
                  </Chip>
                )}
                {teamSeason.billingConfig?.prorateSeasonFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Tarifa Temporada (Pago Único)
                  </Chip>
                )}
                {!teamSeason.billingConfig?.prorateRegistrationFee &&
                  !teamSeason.billingConfig?.prorateFirstRecurringFee &&
                  !teamSeason.billingConfig?.prorateLastRecurringFee &&
                  !teamSeason.billingConfig?.prorateSeasonFee && (
                    <span className="text-xs italic text-muted-foreground">
                      Ninguna (Se cobran los montos completos siempre)
                    </span>
                  )}
              </div>
            </div>
          </div>

          <Alert status="accent">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Edades Permitidas</Alert.Title>
              <Alert.Description>
                {teamSeason.minBirthYear || teamSeason.maxBirthYear
                  ? `Se han restringido los años de nacimiento permitidos desde ${teamSeason.minBirthYear || "Cualquiera"} hasta ${teamSeason.maxBirthYear || "Cualquiera"}.`
                  : `Los atletas deben tener una edad deportiva entre ${teamSeason.category.minAge} y ${teamSeason.category.maxAge} años.`}
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </Card>

        <MetricsCards
          teamSeason={teamSeason}
          totalItems={
            membershipsResponse.data?.summary?.occupiedSlotsCount || 0
          }
          globalTotalPending={membershipsResponse.data?.summary?.totalPending}
          globalTotalPaid={membershipsResponse.data?.summary?.totalPaid}
          activeMembers={membershipsResponse.data?.summary?.activeMembers}
          suspendedMembers={membershipsResponse.data?.summary?.suspendedMembers}
          pendingMembers={membershipsResponse.data?.summary?.pendingMembers}
          totalBilled={membershipsResponse.data?.summary?.totalBilled}
        />

        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Atletas inscritos"
            description="Asigna membresías y revisa los cargos iniciales generados"
            action={
              <div className="w-full flex gap-2 justify-end">
                <CreateMassiveManualChargeButton teamSeasonId={teamSeasonId} />
                <EnrollMembershipDrawer
                  teamSeason={teamSeason}
                  paymentPlans={paymentPlans}
                  size="md"
                />
              </div>
            }
            showButtonBack={false}
          />
          <SectionFilters />
          <TableMemberships memberships={memberships} teamSeason={teamSeason} />
          <PaginationSection
            totalPages={meta.totalPages}
            itemsPerPage={meta.itemsPerPage}
            totalItems={meta.totalItems}
          />
        </Card>
      </div>
    </>
  );
}

import { CreateMassiveManualChargeButton } from "@/modules/player-memberships";
