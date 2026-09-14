"use client";

import { Teams, Team } from "@/modules/web/teams/components/teams-screen";

export default function TeamsContent({
  initialTeams,
}: {
  initialTeams: Team[];
}) {
  return <Teams teams={initialTeams} />;
}
