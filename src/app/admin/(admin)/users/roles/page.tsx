import { getRoles } from "@/modules/users/actions/roles";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import { SplitViewRoles } from "@/modules/users/components/split-view/SplitViewRoles";

export default async function RolesPage() {
  const rolesResponse = await getRoles({ per_page: "100" });

  if (rolesResponse.error && rolesResponse.statusCode === 401) {
    redirect("/login");
  }

  if (rolesResponse.error) {
    return <ErrorPage message={rolesResponse.message} />;
  }

  return (
    <>
      <HeaderPage
        title="Gestión de Roles y Permisos"
        description="Seleccione un rol de la lista para gestionar sus permisos y nivel de acceso."
      />
      <div className="mt-6 h-[calc(100vh-220px)] min-h-125">
        <SplitViewRoles initialRoles={rolesResponse.data.data} />
      </div>
    </>
  );
}
