import { Suspense } from "react";
import TeamsContent from "@/modules/portal/teams/components/teams-content";
import { getPublicTeams } from "@/modules/portal/teams/actions/teams.action";

export const metadata = {
  title: "Equipos y Competición | Club Atlético Nacional",
  description:
    "Conoce nuestros equipos, categorías y oportunidades de membresía en el Club Atlético Nacional.",
  openGraph: {
    images: ["/logo.png"],
  },
};

export default async function TeamsPage() {
  const teamsResponse = await getPublicTeams(false);
  const teams = teamsResponse.data || [];

  return (
    <Suspense fallback={<div className="h-screen" />}>
      <TeamsContent initialTeams={teams} />
    </Suspense>
  );
}
