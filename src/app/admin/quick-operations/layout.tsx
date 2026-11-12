import { getCurrentUserContext } from "@/shared/helpers/server-context";
import { Header, HeaderPage, TabsRouteNavigation, ModuleGuard, GlobalFooter } from "@/ui";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";
import { itemsNavigation } from "@/config";
import { getAllowedChildRoutes } from "@/shared/helpers/permissions";
import { NavigationConfig } from "@/config/navigation";
import { QuickOperationsPersonSelector } from "@/modules/quick-operations/components/QuickOperationsPersonSelector";
import { TriggerLateFeesButton } from "@/modules/quick-operations/components/TriggerLateFeesButton";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function QuickOperationsLayout({ children }: LayoutProps) {
  const context = await getCurrentUserContext();

  if (!context?.user) {
    redirect("/login");
  }

  const userPermissions = context.permissions || [];

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
      <div className="min-h-screen flex flex-col transition-all duration-300">
        <div className="max-w-400 mx-auto flex-1 w-full">
          {/* Container for ultra-wide screens */}
          {/* <!-- TopNavBar --> */}
          <Header
            showLogo={true}
            user={context?.user}
            person={context?.person}
            actions={
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Administración
                </Button>
              </Link>
            }
          />
          {/* <!-- Dashboard Canvas --> */}
          <main className="page-content">
            {/* <!-- Header Section --> */}
            <div className="flex flex-col gap-4 max-w-300 mx-auto pb-10">
              <div className="mb-2 flex items-center justify-between">
                <HeaderPage
                  title="Operaciones Rápidas"
                  description="Gestión unificada de secretaría, operaciones y flujo de caja."
                />
                <TriggerLateFeesButton />
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
        <GlobalFooter />
      </div>
    </ModuleGuard>
  );
}
