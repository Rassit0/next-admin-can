import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import {
  getChargeById,
  getPayments,
  ChargeSummaryCard,
  TablePayments,
  PayChargeDrawer,
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

  const [membershipResponse, chargeResponse, paymentsResponse] =
    await resolvePageData([
      getStudentMembershipById({ id: studentMembershipId }),
      getChargeById(chargeId),
      getPayments({ search, page, per_page, chargeId }),
    ]);

  const membership = membershipResponse.data;
  const charge = chargeResponse.data;
  const payments = paymentsResponse.data;

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
        //     href: `/admin/player-memberships/${studentMembershipId}`,
        //   },
        //   { label: "Cargo" },
        // ]}
      />

      <div className="flex flex-col gap-6 mt-4 w-full max-w-5xl mx-auto">
        <ChargeSummaryCard charge={charge} />

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Historial de Pagos</h3>
            <PayChargeButton
              charge={charge}
              isDisabled={charge.status === "PAID"}
            />
          </div>

          <SectionFilters />

          <TablePayments payments={payments.data} />

          <PaginationSection
            totalPages={payments.meta.totalPages}
            itemsPerPage={payments.meta.itemsPerPage}
            totalItems={payments.meta.totalItems}
          />
        </div>
      </div>
    </>
  );
}
