import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { Header, HeaderPage, TabsRouteNavigation } from "@/ui";
import { redirect } from "next/navigation";
import React from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

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

  // Comprobar permisos reales
  // Quick Operations generalmente está disponible para secretarios
  // Cash Flow / Dashboard están protegidos por permisos financieros
  const hasFinancePermission = userPermissions.some(
    (p) =>
      p.endsWith("_ACCOUNT_CHARGES") ||
      p.endsWith("_TRANSACTIONS") ||
      p.endsWith("_ACCOUNT_CATEGORIES"),
  );

  const tabsRoutes = [{ value: "/", title: "Ficha Personal" }];

  if (hasFinancePermission) {
    tabsRoutes.push({ value: "/cash-flow", title: "Flujo de Caja" });
    tabsRoutes.push({ value: "/dashboard", title: "Resumen" });
    tabsRoutes.push({ value: "/reports", title: "Reportes" });
  }

  return (
    <div className="min-h-screen transition-all duration-300">
      <div className="max-w-400 mx-auto">
        {/* Container for ultra-wide screens */}
        {/* <!-- TopNavBar --> */}
        <Header 
          showLogo={true}
          actions={
            <Link href="/admin/dashboard">
              <Button 
                variant="outline" 
                size="sm"
              >
                Administración
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
                title="Operaciones Rápidas"
                description="Gestión unificada de secretaría, operaciones y flujo de caja."
              />
            </div>

            <TabsRouteNavigation
              routes={tabsRoutes}
              basePath={`/admin/quick-operations`}
              defaultRoute="/"
              variant="primary"
            />

            <div className="mt-2">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
