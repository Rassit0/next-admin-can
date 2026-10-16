import React from "react";
import { HeaderPage } from "@/ui";
import { DashboardPeriodSelector } from "./DashboardPeriodSelector";
import { DashboardQuickActions } from "./DashboardQuickActions";

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  permissions?: string[];
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Panel de Control",
  description = "Resumen general de Gestión360",
  permissions = [],
}) => {
  return (
    <HeaderPage
      title={title}
      description={description}
      showButtonBack={false}
      action={
        <div className="flex items-center gap-2 sm:gap-3">
          <DashboardQuickActions permissions={permissions} />
          <DashboardPeriodSelector />
        </div>
      }
    />
  );
};
