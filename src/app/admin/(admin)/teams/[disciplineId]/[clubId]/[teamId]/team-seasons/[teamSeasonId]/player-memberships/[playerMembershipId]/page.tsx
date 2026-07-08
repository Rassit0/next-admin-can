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
  getPlayerMembershipById,
  getPlayerMemberships,
  MetricsCards,
  TableMemberships,
} from "@/modules/player-memberships";
import { Button, Card, Alert, Chip, Tabs } from "@heroui/react";
import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getCharges, TableCharges } from "@/modules/charges";

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
    playerMembershipId: string;
  }>;
}

export default async function PlayerMembershipPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { disciplineId, clubId, teamId, teamSeasonId, playerMembershipId } =
    await params;

  const [membershipResponse, teamSeasonResponse, chargesResponse] =
    await Promise.all([
      getPlayerMembershipById({ id: playerMembershipId }),
      getTeamSeasonById({ id: teamSeasonId }),
      getCharges({
        search,
        page,
        per_page,
        playerMembershipId,
      }),
    ]);

  if (membershipResponse.error && membershipResponse.statusCode === 401) {
    redirect("/login");
  }
  if (teamSeasonResponse.error) {
    return <ErrorPage message={teamSeasonResponse.message} />;
  }
  if (membershipResponse.error) {
    return <ErrorPage message={membershipResponse.message} />;
  }

  const teamSeason = teamSeasonResponse.data;
  const charges = chargesResponse.error
    ? {
        data: [],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 1,
          totalItems: 0,
        },
      }
    : chargesResponse.data;

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
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/player-memberships`,
          },
          {
            label: `Cargos - ${teamSeason.category.name} (${GENDER_MAP[teamSeason.gender] || teamSeason.gender}) - ${teamSeason.season.name}`,
          },
        ]}
      />

      <Tabs className="w-full" variant="secondary">
        <Tabs.ListContainer>
          <Tabs.List aria-label="Charges">
            <Tabs.Tab id="charges" className="py-6 md:py-2">
              Cargos
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="info" className="py-6 md:py-2">
              Información General
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="medical-info" className="py-6 md:py-2">
              Información Médica
              <Tabs.Indicator />
            </Tabs.Tab>
            <Tabs.Tab id="memberships" className="py-6 md:py-2">
              Membresías
              <Tabs.Indicator />
            </Tabs.Tab>
          </Tabs.List>
        </Tabs.ListContainer>
        <Tabs.Panel className="pt-4" id="charges">
          <div className="flex w-full flex-col gap-4">
            <SectionFilters />
            <TableCharges charges={charges.data} />
            <PaginationSection
              totalPages={charges.meta.totalPages}
              itemsPerPage={charges.meta.itemsPerPage}
              totalItems={charges.meta.totalItems}
            />
          </div>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="contact-info">
          <p>Información de Contacto.</p>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="medical-info">
          <p>Información Médica.</p>
        </Tabs.Panel>
        <Tabs.Panel className="pt-4" id="memberships">
          <p>Membresías.</p>
        </Tabs.Panel>
      </Tabs>
    </>
  );
}
