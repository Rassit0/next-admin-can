import { HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";
import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { itemsNavigation } from "@/config";
import { getAllowedChildRoutes } from "@/shared/helpers/permissions";
import { NavigationConfig } from "@/config/navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AccountingTabsLayout({ children }: LayoutProps) {
  const session = await auth();
  let userPermissions: string[] = [];

  if (session?.user?.roleId) {
    const permRes = await getPermissionsArray({ roleId: session.user.roleId });
    if (!permRes.error && permRes.data) {
      userPermissions = permRes.data;
    }
  }

  const allowedRoutes = getAllowedChildRoutes(
    "accounting",
    userPermissions,
    itemsNavigation as NavigationConfig[],
  );

  const tabsRoutes = allowedRoutes
    .filter((route) => route.showInTabs)
    .map((route) => ({
      value: route.href.replace(/^\/admin\/accounting/, "") || "/",
      title: route.label || "",
    }));

  return (
    <>
      <HeaderPage
        title="Contabilidad"
        description="Gestiona los ingresos, egresos, categorías y visualiza el estado financiero."
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={`/admin/accounting`}
          defaultRoute="/"
        />
        <div className="mt-6">{children}</div>
      </div>
    </>
  );
}
