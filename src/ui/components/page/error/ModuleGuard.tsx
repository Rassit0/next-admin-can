import { hasModuleAccess } from "@/config/navigation-access";
import { ErrorPage } from "@/ui/components/page/error/ErrorPage";
import { getCurrentUserPermissions } from "@/shared/helpers/server-permissions";

interface Props {
  moduleId: string;
  childRouteId?: string;
  children: React.ReactNode;
}

export const ModuleGuard = async ({
  moduleId,
  childRouteId,
  children,
}: Props) => {
  const userPermissions = await getCurrentUserPermissions();

  if (!hasModuleAccess(moduleId, userPermissions, childRouteId)) {
    return (
      <ErrorPage
        message="403 - No tienes permisos para acceder a esta sección."
        path={{ href: "/admin", label: "Volver a Administración" }}
      />
    );
  }

  return <>{children}</>;
};
