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

export default async function TeamSeasonDetailLayout({
  children,
}: LayoutProps) {
  const session = await auth();
  let userPermissions: string[] = [];

  if (session?.user?.roleId) {
    const permRes = await getPermissionsArray({ roleId: session.user.roleId });
    if (!permRes.error && permRes.data) {
      userPermissions = permRes.data;
    }
  }

  const allowedRoutes = getAllowedChildRoutes("memberships", userPermissions, itemsNavigation as NavigationConfig[]);
  
  const tabsRoutes = allowedRoutes
    .filter((route) => route.showInTabs)
    .map((route) => ({
      value: route.href.replace(/^\/admin\/memberships/, "") || "/",
      title: route.label || "",
    }));

  return (
    <>
      <HeaderPage
        title="Membresías"
        description="Gestiona las membresías de los jugadores y estudiantes de tu organización."
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={`/admin/memberships`}
          defaultRoute="/"
        />
        {children}
      </div>
    </>
  );
}
