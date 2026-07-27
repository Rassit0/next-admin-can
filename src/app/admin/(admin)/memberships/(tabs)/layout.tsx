import { HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default async function TeamSeasonDetailLayout({
  children,
}: LayoutProps) {
  const tabsRoutes = [
    { value: "/", title: "Información General" },
    { value: "/player-memberships", title: "Jugadores" },
    { value: "/student-memberships", title: "Estudiantes" },
  ];

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
