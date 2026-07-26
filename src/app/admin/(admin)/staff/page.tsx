import { getStaff, StaffTable } from "@/modules/staff";
import { CreateStaffModal } from "@/modules/staff";
import { ErrorPage, HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import {
  Alert01Icon,
  UserAdd01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: string;
    orderBy?: string;
  }>;
}

export default async function StaffPage({ searchParams }: Props) {
  const { search, page, per_page, sortField, orderBy } = await searchParams;
  const staffResponse = await getStaff({
    search,
    page,
    per_page,
    sortField,
    orderBy,
  });

  if (staffResponse.error && staffResponse.statusCode === 401) {
    redirect("/login");
  }

  if (staffResponse.error) {
    return <ErrorPage message={staffResponse.message} />;
  }

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Directorio del Personal (Staff)"
          description="Gestión del personal."
          action={<CreateStaffModal />}
        />
        
        {/* <!-- Filters Bento --> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={UserGroupIcon} className="text-sky-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Total Personal
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {staffResponse.data?.meta?.totalItems || 0}
              </p>
            </div>
          </div>
        </div>

        <SectionFilters />

        {/* <!-- Data Table Section --> */}
        <div className="bg-default/50 rounded-xl overflow-hidden shadow-sm border border-default-200">
          <div className="border-b border-default-200 p-4 bg-white/50 dark:bg-default-100/50 flex justify-between items-center">
            <h2 className="text-lg font-bold font-headline">Lista de Personal</h2>
          </div>
          <div className="p-0">
            <StaffTable staffs={staffResponse.data?.data || []} />
          </div>
          <div className="p-4 bg-white/50 dark:bg-default-100/50 border-t border-default-200 flex justify-between items-center text-sm text-default-500">
            <PaginationSection
              totalPages={staffResponse.data?.meta.totalPages}
              itemsPerPage={staffResponse.data?.meta.itemsPerPage}
              totalItems={staffResponse.data?.meta.totalItems}
            />
          </div>
        </div>
      </div>
    </>
  );
}
