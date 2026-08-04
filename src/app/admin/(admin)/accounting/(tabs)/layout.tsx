import { HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function AccountingTabsLayout({
  children,
}: LayoutProps) {
  const tabsRoutes = [
    { value: "/", title: "Dashboard" },
    { value: "/cash-flow", title: "Flujo de Caja" },
    { value: "/accounts", title: "Cuentas y Bancos" },
    { value: "/transfers", title: "Transferencias" },
    { value: "/receivables", title: "Por Cobrar" },
    { value: "/payables", title: "Por Pagar" },
    { value: "/categories", title: "Categorías" },
    { value: "/reports", title: "Reportes" },
  ];

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
        <div className="mt-6">
          {children}
        </div>
      </div>
    </>
  );
}
