import { ErrorPage, HeaderPage, TabsRouteNavigation } from "@/ui";
import React from "react";
import { resolvePageData } from "@/utils/resolvePageData";
import { getPlayerMembershipById } from "@/modules/player-memberships";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    playerId: string;
    playerMembershipId: string;
  }>;
}

export default async function TeamSeasonDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { playerId, playerMembershipId } = await params;

  const [membershipRes] = await resolvePageData([
    getPlayerMembershipById({ id: playerMembershipId }),
  ]);

  const membership = membershipRes.data;

  const baseUrl = `/admin/players/${playerId}/player-memberships/${playerMembershipId}`;
  const tabsRoutes = [
    { value: "/", title: "Información General" },
    { value: "/charges", title: "Cargos" },
    // { value: "/player-memberships", title: "Membresías" },
    // { value: "/payment-plans", title: "Planes de Pago" },
    // { value: "/payments", title: "Transacciones" },
  ];

  return (
    <>
      <HeaderPage
        title={
          membership.player
            ? `Membresía - ${membership.player.person.name} ${membership.player.person.lastName} ${membership.player.person.secondLastName || ""}`
            : "Membresía del Atleta"
        }
        description={`Equipo: ${membership.teamSeason.team.name} · Categoría: ${membership.teamSeasonCategories?.category?.name || 'N/A'} · Temporada: ${membership.teamSeason.season.name}`}
        // breadcrumb={[
        //   { label: "Membresías", href: `/admin/player-memberships` },
        //   {
        //     label: `Detalles`,
        //   },
        // ]}
      />
      <div className="flex flex-col page-content">
        <TabsRouteNavigation
          routes={tabsRoutes}
          basePath={baseUrl}
          defaultRoute={baseUrl}
        />
        {children}
      </div>
    </>
  );
}
