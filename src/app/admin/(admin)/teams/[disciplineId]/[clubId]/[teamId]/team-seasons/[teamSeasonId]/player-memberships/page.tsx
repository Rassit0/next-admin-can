import {
  ButtonBack,
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
} from "@/ui";
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
import { Button, Card, Alert, Chip } from "@heroui/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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
            <ButtonBack />
          </>
        }
        breadcrumb={[
          { label: "Gestión Equipos", href: `/` },
          {
            label: `Gestión de Temporadas - ${teamSeason.team.name}`,
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons`,
          },
          {
            label: `Membresías - ${teamSeason.category.name} (${GENDER_MAP[teamSeason.gender] || teamSeason.gender}) - ${teamSeason.season.name}`,
          },
        ]}
      />

      <div className="flex flex-col gap-6 page-content">
        <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border flex flex-col gap-5 bg-surface-container-lowest">
          <div className="flex items-center justify-between">
            <h3 className="font-headline font-bold text-lg">
              Resumen Financiero y Reglas
            </h3>
            <Chip
              color="accent"
              variant="soft"
              size="sm"
              className="font-semibold tracking-wide uppercase"
            >
              Género: {GENDER_MAP[teamSeason.gender] || teamSeason.gender}
            </Chip>
          </div>
          <hr className="border-border" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">
                Modelo de Cobro
              </p>
              <p className="font-bold text-sm">
                {teamSeason.billingType === "MONTHLY_ONLY" && "Sólo Recurrente"}
                {teamSeason.billingType === "SINGLE_ONLY" && "Sólo Pago Único"}
                {teamSeason.billingType === "BOTH" && "Pago Único o Recurrente"}
              </p>
            </div>
            {teamSeason.billingType !== "SINGLE_ONLY" && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">
                    Matrícula
                  </p>
                  <p className="font-bold text-sm">
                    {teamSeason.registrationFee
                      ? `${teamSeason.registrationFee} Bs.`
                      : "Gratis"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">
                    Cuota Base (
                    {teamSeason.billingFrequency === "WEEKLY"
                      ? "Semanal"
                      : teamSeason.billingFrequency === "BIWEEKLY"
                        ? "Quincenal"
                        : "Mensual"}
                    )
                  </p>
                  <p className="font-bold text-sm">
                    {teamSeason.recurringFee
                      ? `${teamSeason.recurringFee} Bs.`
                      : "Gratis"}
                  </p>
                </div>
              </>
            )}
            {(teamSeason.billingType === "SINGLE_ONLY" ||
              teamSeason.billingType === "BOTH") && (
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">
                  Tarifa Temporada Completa
                </p>
                <p className="font-bold text-sm">
                  {teamSeason.seasonFee
                    ? `${teamSeason.seasonFee} Bs.`
                    : "Gratis"}
                </p>
              </div>
            )}
            <div className="col-span-full">
              <p className="text-xs text-muted-foreground mb-2 uppercase font-semibold">
                Opciones de Prorrateo Activas
              </p>
              <div className="flex flex-wrap gap-2">
                {teamSeason.prorateRegistrationFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Matrícula
                  </Chip>
                )}
                {teamSeason.prorateFirstRecurringFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Primer Cargo Recurrente
                  </Chip>
                )}
                {teamSeason.prorateLastRecurringFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Último Cargo Recurrente
                  </Chip>
                )}
                {teamSeason.prorateSeasonFee && (
                  <Chip size="sm" variant="soft" color="default">
                    Tarifa Temporada (Pago Único)
                  </Chip>
                )}
                {!teamSeason.prorateRegistrationFee &&
                  !teamSeason.prorateFirstRecurringFee &&
                  !teamSeason.prorateLastRecurringFee &&
                  !teamSeason.prorateSeasonFee && (
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
          memberships={memberships}
          teamSeason={teamSeason}
          totalItems={meta.totalItems}
        />

        <Card className="shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
          <HeaderPage
            title="Atletas inscritos"
            description="Asigna membresías y revisa los cargos iniciales generados"
            action={
              <div className="w-full">
                <EnrollMembershipDrawer
                  teamSeason={teamSeason}
                  paymentPlans={paymentPlans}
                  size="md"
                />
              </div>
            }
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
