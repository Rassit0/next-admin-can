import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { Header, HeaderPage, TabsRouteNavigation, ModuleGuard } from "@/ui";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { itemsNavigation } from "@/config";
import { getAllowedChildRoutes } from "@/shared/helpers/permissions";
import { NavigationConfig } from "@/config/navigation";
import { QuickOperationsPersonSelector } from "@/modules/quick-operations/components/QuickOperationsPersonSelector";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function QuickOperationsLayout({ children }: LayoutProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  let userPermissions: string[] = [];

  if (session?.user?.roleId) {
    const permRes = await getPermissionsArray({ roleId: session.user.roleId });
    if (!permRes.error && permRes.data) {
      userPermissions = permRes.data;
    }
  }

  const allowedRoutes = getAllowedChildRoutes(
    "quick-operations",
    userPermissions,
    itemsNavigation as NavigationConfig[],
  );

  const tabsRoutes = allowedRoutes
    .filter((route) => route.showInTabs)
    .map((route) => ({
      value:
        route.href.replace(/^\/admin\/quick-operations(\/\[personId\])?/, "") ||
        "/",
      title: route.label || "",
    }));

  return (
    <ModuleGuard moduleId="quick-operations">
      <div className="min-h-screen transition-all duration-300">
        <div className="max-w-400 mx-auto">
          {/* Container for ultra-wide screens */}
          {/* <!-- TopNavBar --> */}
          <Header
            showLogo={true}
            actions={
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  AdministraciÃ³n
                </Button>
              </Link>
            }
          />
          {/* <!-- Dashboard Canvas --> */}
          <main className="page-content">
            {/* <!-- Header Section --> */}
            <div className="flex flex-col gap-4 max-w-300 mx-auto pb-10">
              <div className="mb-2">
                <HeaderPage
                  title="Operaciones RÃ¡pidas"
                  description="GestiÃ³n unificada de secretarÃ­a, operaciones y flujo de caja."
                />
              </div>

              <TabsRouteNavigation
                routes={tabsRoutes}
                basePath={`/admin/quick-operations`}
                defaultRoute="/"
                variant="primary"
              />

              <QuickOperationsPersonSelector />

              <div className="mt-2">{children}</div>
            </div>
          </main>
        </div>
      </div>
    </ModuleGuard>
  );
}
