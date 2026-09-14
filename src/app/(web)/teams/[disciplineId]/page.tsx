import { Suspense } from "react";
import TeamsContent from "@/modules/web/teams/components/teams-content";
import { getPublicTeams } from "@/modules/web/teams/actions/teams.action";

export const metadata = {
  title: "Equipos y Competición | Club Atlético Nacional",
  description:
    "Conoce nuestros equipos, categorías y oportunidades de membresía en el Club Atlético Nacional.",
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
