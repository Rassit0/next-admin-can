"use client";

import { Teams, Team } from "@/modules/portal/teams/components/teams-screen";

export default function TeamsContent({
  initialTeams,
}: {
  initialTeams: Team[];
}) {
  return <Teams teams={initialTeams} />;
}
