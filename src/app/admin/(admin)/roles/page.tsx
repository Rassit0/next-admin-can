import { getRoles, getPermissions } from "@/modules/users/actions/roles";
import { SplitViewRoles } from "@/modules/users/components/split-view/SplitViewRoles";
import { HeaderPage } from "@/ui";
import { resolvePageData } from "@/utils/resolvePageData";

export default async function RolesPage() {
  const [rolesResponse, permissionsResponse] = await resolvePageData([
    getRoles({ per_page: "100" }),
    getPermissions({ per_page: "500" }),
  ]);

  const roles = rolesResponse.data?.data || [];
  const permissions = permissionsResponse.data?.data || [];

  return (
    <>
      <HeaderPage
        title="Gestión de Roles y Permisos"
        description="Administre los roles del sistema y asigne los permisos correspondientes."
      />
      <div className="mt-6 h-[calc(100vh-220px)] min-h-125">
        <SplitViewRoles initialRoles={roles} permissions={permissions} />
      </div>
    </>
  );
}
