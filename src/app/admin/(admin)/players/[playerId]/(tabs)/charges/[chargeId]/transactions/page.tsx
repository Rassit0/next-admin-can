import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import {
  getChargeById,
  getTransactions,
  ChargeSummaryCard,
  TableTransactions,
  PayChargeDrawer,
} from "@/modules/charge-transactions";
import { getPlayerMembershipById } from "@/modules/player-memberships";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { PayChargeButton } from "./PayChargeButton";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{
    disciplineId: string;
    clubId: string;
    teamId: string;
    teamSeasonId: string;
    playerMembershipId: string;
    chargeId: string;
  }>;
}

export default async function ChargeTransactionsPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page } = await searchParams;
  const {
    disciplineId,
    clubId,
    teamId,
    teamSeasonId,
    playerMembershipId,
    chargeId,
  } = await params;

  const [membershipResponse, chargeResponse, transactionsResponse] =
    await Promise.all([
      getPlayerMembershipById({ id: playerMembershipId }),
      getChargeById(chargeId),
      getTransactions({ search, page, per_page, chargeId }),
    ]);

  if (
    membershipResponse.error ||
    chargeResponse.error ||
    transactionsResponse.error
  ) {
    return (
      <ErrorPage
        message={
          membershipResponse.message ||
          chargeResponse.message ||
          transactionsResponse.message
        }
      />
    );
  }

  const membership = membershipResponse.data;
  const charge = chargeResponse.data;

  const transactions = transactionsResponse.error
    ? {
        data: [],
        meta: {
          currentPage: 1,
          itemsPerPage: 10,
          totalPages: 1,
          totalItems: 0,
        },
      }
    : transactionsResponse.data;

  // Render Client Component for the Drawer state
  return (
    <>
      <HeaderPage
        title={`Detalles de Cargo`}
        description={`Membresía: ${membership.player?.person.name} ${membership.player?.person.lastName}`}
        breadcrumb={[
          { label: "Equipos", href: `/` },
          {
            label: "Membresías",
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/player-memberships`,
          },
          {
            label: "Jugador",
            href: `/admin/teams/${disciplineId}/${clubId}/${teamId}/team-seasons/${teamSeasonId}/player-memberships/${playerMembershipId}`,
          },
          { label: "Pagos" },
        ]}
      />

      <div className="flex flex-col gap-6 mt-4 w-full max-w-5xl mx-auto">
        <ChargeSummaryCard charge={charge} />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Historial de Pagos</h3>
            {charge.status !== "PAID" && (
              <PayChargeButton charge={charge} />
            )}
          </div>

          <SectionFilters />

          <TableTransactions transactions={transactions.data} />

          <PaginationSection
            totalPages={transactions.meta.totalPages}
            itemsPerPage={transactions.meta.itemsPerPage}
            totalItems={transactions.meta.totalItems}
          />
        </div>
      </div>
    </>
  );
}
