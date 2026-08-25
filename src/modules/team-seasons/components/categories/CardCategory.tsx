"use client";

import { Button, Card, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { ITeamSeasonCategory } from "@/modules/team-seasons";
import { activateTeamSeasonCategory, deactivateTeamSeasonCategory } from "../../actions/categories.actions";
import { toast } from "@heroui/react";
import { useState } from "react";

interface Props {
  teamSeasonId: string;
  category: ITeamSeasonCategory;
  onEdit: (category: ITeamSeasonCategory) => void;
}

export const CardCategory = ({ teamSeasonId, category, onEdit }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const GENDER_MAP = {
    MALE: "Masculino",
    FEMALE: "Femenino",
    MIXED: "Mixto",
  };

  const handleToggleStatus = async () => {
    setIsLoading(true);
    let res;
    if (category.isActive) {
      res = await deactivateTeamSeasonCategory(teamSeasonId, category.id);
    } else {
      res = await activateTeamSeasonCategory(teamSeasonId, category.id);
    }
    setIsLoading(false);

    if (res.error) {
      toast.danger(res.message || "Ocurrió un error al cambiar el estado de la categoría");
      return;
    }

    toast.success(`Categoría ${category.isActive ? "desactivada" : "activada"} exitosamente`);
  };

  return (
    <Card className="p-5 shadow-sm group hover:shadow-md transition-all duration-300 relative flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-bold text-foreground">
            {category.category.name}
          </h4>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-1">
            {GENDER_MAP[category.gender]}
          </p>
        </div>
        <Chip
          size="sm"
          variant="soft"
          color={category.isActive ? "success" : "default"}
        >
          {category.isActive ? "Activa" : "Inactiva"}
        </Chip>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-auto mb-4 text-sm">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Miembros</p>
          <p className="font-semibold text-foreground">
            {category.minMembers} - {category.maxMembers}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Año de Nac.</p>
          <p className="font-semibold text-foreground">
            {category.minBirthYear || "-"} - {category.maxBirthYear || "-"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2 border-t border-border pt-4">
        <button
          type="button"
          className="flex-1 h-8 px-3 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary-soft transition-colors"
          onClick={() => onEdit(category)}
        >
          Editar
        </button>
        <button
          type="button"
          className={`flex-1 h-8 px-3 rounded-md border text-sm font-medium transition-colors ${
            category.isActive 
              ? "border-danger text-danger hover:bg-danger/10" 
              : "border-success text-success hover:bg-success/10"
          }`}
          onClick={handleToggleStatus}
          disabled={isLoading}
        >
          {category.isActive ? "Desactivar" : "Activar"}
        </button>
      </div>
    </Card>
  );
};
