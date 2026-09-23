import { getUsers } from "@/modules/users/actions/users";
import { HeaderPage, PaginationSection, SectionFilters } from "@/ui";
import {
  UserAdd01Icon,
  UserGroupIcon,
  Shield01Icon,
  Shield02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TableUsers } from "@/modules/users/components/table/TableUsers";
import { CreateUserButton } from "@/modules/users/components/form/CreateUserButton";
import { resolvePageData } from "@/utils/resolvePageData";

interface Props {
  searchParams: Promise<{
    search?: string;
    per_page?: string;
    page?: string;
    sortField?: string;
    orderBy?: string;
  }>;
}

export default async function UsersPage({ searchParams }: Props) {
  const {
    search,
    page,
    per_page = "5",
    sortField,
    orderBy,
  } = await searchParams;

  const [usersResponse] = await resolvePageData([
    getUsers({
      search: search || "",
      page: page || "1",
      per_page: per_page || "10",
      sortField: sortField || "createdAt",
      orderBy: orderBy || "desc",
    }),
  ]);

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Gestión de Usuarios"
          description="Administre el acceso al sistema, asigne roles y controle permisos."
          action={<CreateUserButton />}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={UserGroupIcon} className="text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Total Usuarios
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                {usersResponse.data.meta.totalItems}
              </p>
            </div>
          </div>
          <div className="bg-default/50 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-white dark:bg-default p-3 rounded-lg shadow-sm">
              <HugeiconsIcon icon={Shield01Icon} className="text-accent" />
            </div>
            <div>
              <p className="text-xs font-bold text-default-foreground/50 uppercase tracking-widest">
                Roles Activos
              </p>
              <p className="text-xl font-black font-headline text-default-foreground">
                -
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-3 mt-6">
        <SectionFilters />
        <TableUsers users={usersResponse.data.data} />
        <PaginationSection
          totalPages={usersResponse.data?.meta.totalPages}
          itemsPerPage={usersResponse.data?.meta.itemsPerPage}
          totalItems={usersResponse.data?.meta.totalItems}
        />
      </div>
    </>
  );
}
