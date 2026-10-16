import React from "react";
import { Card } from "@heroui/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface EmptyGroupsCardProps {
  message?: string;
  description?: string;
}

export const EmptyGroupsCard: React.FC<EmptyGroupsCardProps> = ({
  message = "No tienes grupos asignados actualmente.",
  description = "Comunícate con la coordinación deportiva o secretaría para que vinculen tus asignaciones docentes o de cuerpo técnico.",
}) => {
  return (
    <Card className="p-8 text-center border border-dashed border-divider bg-content1/50 flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-full bg-default-100 flex items-center justify-center text-default-500 mb-3">
        <HugeiconsIcon icon={UserGroupIcon} size={28} />
      </div>
      <h4 className="text-base font-bold text-foreground mb-1">{message}</h4>
      <p className="text-xs text-default-500 max-w-sm">{description}</p>
    </Card>
  );
};
