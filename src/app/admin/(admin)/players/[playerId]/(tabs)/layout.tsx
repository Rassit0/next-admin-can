import { ErrorPage, HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";
import { resolvePageData } from "@/utils/resolvePageData";
import { getPlayerById } from "@/modules/players";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    playerId: string;
  }>;
}

const GENDER_MAP: Record<string, string> = {
  MALE: "Masculino",
  FEMALE: "Femenino",
  MIXED: "Mixto",
};

export default async function PlayerGestionLayout({
  children,
  params,
}: LayoutProps) {
  const { playerId } = await params;

  const [playerRes] = await resolvePageData([getPlayerById({ id: playerId })]);
  const player = playerRes.data;

  const basePath = `/admin/players/${playerId}`;

  const tabsRoutes = [
    { value: "/", title: "Información General" },
    { value: "/player-memberships", title: "Membresías" },
    // { value: "/charges", title: "Cargos" },
    // { value: "/payments", title: "Transacciones" },
  ];

  return (
    <>
      <HeaderPage
        title={`${player.person.name} ${player.person.lastName}`}
        description={`Jugador · ${player.person.documentNumber || "Sin documento"}`}
        breadcrumb={[
          { label: "Lista", href: `/admin/players` },
          {
            label: "Jugador",
          },
        ]}
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={basePath}
          defaultRoute="/"
        />

        {children}
      </div>
    </>
  );
}
