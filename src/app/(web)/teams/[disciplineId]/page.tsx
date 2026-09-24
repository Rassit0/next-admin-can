import { Suspense } from "react";
import TeamsContent from "@/modules/portal/teams/components/teams-content";
import { getPublicTeams } from "@/modules/portal/teams/actions/teams.action";

export const metadata = {
  title: "Equipos y Competición | Club Atli©tico Nacional",
  description:
    "Conoce nuestros equipos, categorías y oportunidades de membresi­a en el Club Atli©tico Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default async function EquiposPage() {
  const teamsResponse = await getPublicTeams(false);
  const teams = teamsResponse.data || [];

  return (
    <Suspense fallback={<div className="h-screen" />}>
      <TeamsContent initialTeams={teams} />
    </Suspense>
  );
}
