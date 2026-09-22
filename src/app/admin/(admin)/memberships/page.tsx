import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { getFirstAllowedChildRoute } from "@/shared/helpers/permissions";
import { itemsNavigation as allowedNavigation } from "@/config";
import { redirect } from "next/navigation";
import { ErrorPage } from "@/ui";

export default async function MembershipsIndexPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  let userPermissions: string[] = [];
  if (session?.user?.roleId) {
    const permRes = await getPermissionsArray({ roleId: session.user.roleId });
    if (!permRes.error && permRes.data) {
      userPermissions = permRes.data;
    }
  }

  const firstAllowedChild = getFirstAllowedChildRoute("memberships", userPermissions, allowedNavigation);

  if (!firstAllowedChild) {
    return (
      <ErrorPage
        message="403 - No tienes permisos para acceder a ninguna sección de Membresías."
        path={{ href: "/admin", label: "Volver a Administración" }}
      />
    );
  }

  redirect(firstAllowedChild.href);
}
