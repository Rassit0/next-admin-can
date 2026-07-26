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
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
    playerMembershipId: string;
  }>;
}

export default async function PlayerMembershipChargesPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { disciplineId, clubId, teamId, teamSeasonId, playerMembershipId } =
    await params;

  const [chargesRes] = await resolvePageData([
    getCharges({
      search,
      page,
      per_page,
      playerMembershipId,
    }),
  ]);
  const charges = chargesRes.data;

  const urlBase = `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/player-memberships/${playerMembershipId}/charges/`;

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between items-center">
          <SectionFilters
            actions={
              <CreateManualChargeButton
                playerMembershipId={playerMembershipId}
              />
            }
          />
        </div>
        <TableCharges charges={charges.data} urlBase={urlBase} />
        <PaginationSection
          totalPages={charges.meta.totalPages}
          itemsPerPage={charges.meta.itemsPerPage}
          totalItems={charges.meta.totalItems}
        />
      </div>
    </>
  );
}

import { resolvePageData } from "@/utils/resolvePageData";
import { CreateManualChargeButton } from "./CreateManualChargeButton";
