import React from "react";
import { Metadata } from "next";
import { auth } from "@/auth";
import { getPermissionsArray } from "@/modules/roles";
import { hasRequiredPermissions } from "@/shared/helpers/permissions";
import { TeamSeasonCategoryReportForm } from "@/modules/reports/components/TeamSeasonCategoryReportForm";

export const metadata: Metadata = {
  title: "Reportes Generales | Gestión360",
};

export default async function GeneralReportsPage() {
  const session = await auth();
  let userPermissions: string[] = [];

  if (session?.user?.roleId) {
    const permRes = await getPermissionsArray({ roleId: session.user.roleId });
    if (!permRes.error && permRes.data) {
      userPermissions = permRes.data;
    }
  }

  const canReadTeamSeasons = hasRequiredPermissions(userPermissions, {
    anyOf: ["READ_TEAM_SEASONS"],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reportes Generales</h1>
        <p className="text-sm text-gray-500">
          Visualiza y genera reportes consolidados y de equipos del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {canReadTeamSeasons && <TeamSeasonCategoryReportForm />}
      </div>
    </div>
  );
}

