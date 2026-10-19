import { getStaff, StaffTable, CreateStaffModal } from "@/modules/staff";
import {
  ErrorPage,
  HeaderPage,
  PaginationSection,
  SectionFilters,
  StatusFilter,
} from "@/ui";
import {
  UserGroupIcon,
  CheckmarkCircle02Icon,
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
    status?: string;
  }>;
}

export default async function StaffPage({ searchParams }: Props) {
  const {
    search,
    page,
    per_page = "10",
    sortField,
    orderBy,
    status,
  } = await searchParams;

  const staffResponse = await getStaff({
    search,
    page,
    per_page,
    sortField,
    orderBy,
    status,
  });

  if (staffResponse.error && staffResponse.statusCode === 401) {
    redirect("/login");
  }

  if (staffResponse.error) {
    return <ErrorPage message={staffResponse.message} />;
  }

  const statusLabel =
    status === "ACTIVE"
      ? "Personal Activo"
      : status === "INACTIVE"
      ? "Personal Inactivo"
      : "Total Registros";

  return (
    <div className="space-y-8">
      <HeaderPage
        title="Directorio de Personal (Staff)"
        description="Gestión y administración del personal técnico, docente y operativo del club."
        action={<CreateStaffModal />}
      />

      {/* Bento Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4 border border-default-200">
          <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
            <HugeiconsIcon icon={UserGroupIcon} className="text-sky-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
              {statusLabel}
            </p>
            <p className="text-xl font-black font-headline text-default-foreground">
              {staffResponse.data?.meta?.totalItems || 0}
            </p>
          </div>
        </div>

        <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4 border border-default-200">
          <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} className="text-emerald-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
              Filtro Activo
            </p>
            <p className="text-sm font-bold text-default-foreground mt-0.5">
              {status === "ACTIVE"
                ? "Solo Activos"
                : status === "INACTIVE"
                ? "Solo Inactivos"
                : "Todos los Estados"}
            </p>
          </div>
        </div>
      </div>

      <SectionFilters>
        <StatusFilter
          label="Estado"
          options={[
            { id: "ALL", name: "Todos los estados" },
            { id: "ACTIVE", name: "Activos" },
            { id: "INACTIVE", name: "Inactivos" },
          ]}
          defaultSelected="ALL"
        />
      </SectionFilters>

      <StaffTable staffs={staffResponse.data?.data || []} />

      <PaginationSection
        totalPages={staffResponse.data?.meta.totalPages}
        itemsPerPage={staffResponse.data?.meta.itemsPerPage}
        totalItems={staffResponse.data?.meta.totalItems}
      />
    </div>
  );
}
