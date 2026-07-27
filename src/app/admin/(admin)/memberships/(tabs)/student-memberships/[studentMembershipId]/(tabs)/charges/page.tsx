import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { getCharges, TableCharges } from "@/modules/charge-transactions";
import { CreateManualChargeButton } from "@/modules/charge-transactions/components/drawer/CreateManualChargeButton";
import { resolvePageData } from "@/utils/resolvePageData";

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

export default async function PlayerMembershipChargesPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page, status } = await searchParams;
  const { studentMembershipId } = await params;

  const [chargesRes] = await resolvePageData([
    getCharges({
      search,
      page,
      per_page,
      studentMembershipId,
    }),
  ]);
  const charges = chargesRes.data;

  const urlBase = `/admin/player-memberships/${studentMembershipId}/charges/`;

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex justify-between items-center">
          <SectionFilters
            actions={
              <CreateManualChargeButton
                studentMembershipId={studentMembershipId}
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
