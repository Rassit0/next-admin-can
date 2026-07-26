import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import { redirect } from "next/navigation";
import { TableShifts } from "@/modules/shifts/components/table/TableShifts";
import { AddModal, getShifts } from "@/modules/shifts";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
  }>;
}

export default async function ShiftsPage({ searchParams }: Props) {
  const { search, page, per_page } = await searchParams;
  const shiftsResponse = await getShifts({
    search,
    page,
    per_page,
  });

  if (shiftsResponse.error && shiftsResponse.statusCode === 401) {
    redirect("/login");
  }

  if (shiftsResponse.error) {
    return <ErrorPage message={shiftsResponse.message} />;
  }

  return (
    <>
      {/* <!-- Header --> */}
      <HeaderPage
        title="Gestión de Turnos"
        description="Administra los turnos de la institución"
        action={<AddModal buttonFloatingMobile />}
      />
      
      {/* <!-- Search and Filter Bar --> */}
      <SectionFilters />
      
      {/* <!-- Main Table --> */}
      <TableShifts shifts={shiftsResponse.data.data} />
      
      <PaginationSection
        totalPages={shiftsResponse.data.meta.totalPages}
        itemsPerPage={shiftsResponse.data.meta.itemsPerPage}
        totalItems={shiftsResponse.data.meta.totalItems}
      />
    </>
  );
}
