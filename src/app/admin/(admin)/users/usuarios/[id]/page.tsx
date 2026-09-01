import { getUserById } from "@/modules/users/actions/users";
import { ErrorPage, HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import { UpdateUserForm } from "@/modules/users/components/form/UpdateUserForm";
import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const userResponse = await getUserById(id);

  if (userResponse.error && userResponse.statusCode === 401) {
    redirect("/login");
  }

  if (userResponse.error) {
    return <ErrorPage message={userResponse.message} />;
  }

  const user = userResponse.data;

  return (
    <div className="space-y-6">
      <Breadcrumbs>
          <BreadcrumbsItem href="/admin/users/usuarios">Usuarios</BreadcrumbsItem>
          <BreadcrumbsItem>{user.email}</BreadcrumbsItem>
      </Breadcrumbs>

      <HeaderPage
        title={`Perfil de Usuario: ${user.email}`}
        description="Gestione la información de acceso y el perfil de la persona asociada a esta cuenta."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <UpdateUserForm user={user} />
        </div>
        <div className="lg:col-span-1">
          <div className="bg-content1 p-6 rounded-xl border border-divider">
            <h3 className="font-semibold text-lg mb-4">Información del Sistema</h3>
            <div className="space-y-3 text-sm text-default-600">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className={user.isActive ? "text-success font-medium" : "text-danger font-medium"}>
                  {user.isActive ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Creado:</span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Última mod:</span>
                <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
              </div>
              {user.role?.isSystem && (
                <div className="mt-4 p-3 bg-warning-50 text-warning-800 rounded-lg text-xs">
                  Este usuario posee un rol protegido por el sistema ({user.role.name}). 
                  Sus permisos y acceso no deben alterarse sin precaución.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
