import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import {
  getChargeById,
  getTransactions,
  ChargeSummaryCard,
  TableTransactions,
} from "@/modules/charge-transactions";
import { PayChargeButton } from "./PayChargeButton";
import { resolvePageData } from "@/utils/resolvePageData";
import { getStudentMembershipById } from "@/modules/student-memberships";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
  params: Promise<{
    studentMembershipId: string;
    chargeId: string;
  }>;
}

export default async function ChargeTransactionsPage({
  searchParams,
  params,
}: Props) {
  const { search, page, per_page } = await searchParams;
  const { studentMembershipId, chargeId } = await params;

  const [membershipResponse, chargeResponse, transactionsResponse] =
    await resolvePageData([
      getStudentMembershipById({ id: studentMembershipId }),
      getChargeById(chargeId),
      getTransactions({ search, page, per_page, chargeId }),
    ]);

  const membership = membershipResponse.data;
  const charge = chargeResponse.data;
  const transactions = transactionsResponse.data;

  // Render Client Component for the Drawer state
  return (
    <>
      <HeaderPage
        title={`Detalles de Cargo`}
        description={`Membresía: ${membership.student?.person.name} ${membership.student?.person.lastName}`}
        // breadcrumb={[
        //   { label: "Membresías", href: `/admin/player-memberships` },
        //   {
        //     label: "Detalles",
        //     href: `/admin/player-memberships/${playerMembershipId}`,
        //   },
        //   { label: "Cargo" },
        // ]}
      />

      <div className="flex flex-col gap-6 mt-4 w-full max-w-5xl mx-auto">
        <ChargeSummaryCard charge={charge} />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Historial de Pagos</h3>
            {charge.status !== "PAID" && <PayChargeButton charge={charge} />}
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
