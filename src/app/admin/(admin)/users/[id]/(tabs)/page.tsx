import { getUserById } from "@/modules/users/actions/users";
import { ErrorPage } from "@/ui";
import { redirect } from "next/navigation";
import { UpdateUserForm } from "@/modules/users/components/form/UpdateUserForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserAccountPage({ params }: Props) {
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <UpdateUserForm user={user} />
      </div>
      <div className="lg:col-span-1">
        <div className="bg-content1 p-6 rounded-xl border border-divider">
          <h3 className="font-semibold text-lg mb-4">
            Informacón del Sistema
          </h3>
          <div className="space-y-3 text-sm text-default-600">
            <div className="flex justify-between">
              <span>Estado:</span>
              <span
                className={
                  user.isActive
                    ? "text-success font-medium"
                    : "text-danger font-medium"
                }
              >
                {user.isActive ? "Activo" : "Inactivo"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Creado:</span>
              <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span>iltima mod:</span>
              <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
            </div>
            {user.role?.isSystem && (
              <div className="mt-4 p-3 bg-warning-50 text-warning-800 rounded-lg text-xs">
                Este usuario posee un rol protegido por el sistema (
                {user.role.name}). Sus permisos y acceso no deben alterarse sin
                precaucón.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
