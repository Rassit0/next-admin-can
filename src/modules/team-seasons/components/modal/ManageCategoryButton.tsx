"use client";

import { Button } from "@heroui/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useState } from "react";
import { DrawerCategory } from "../categories/DrawerCategory";
import { ICategoryOption, ITeamSeason } from "@/modules/team-seasons";
import { getCategoriesByDisciplineOptions } from "@/modules/team-seasons/actions/get-categories-options";
import { toast } from "sonner";

interface Props {
  teamSeason: ITeamSeason;
  urlBase: string;
}

export const ManageCategoryButton = ({ teamSeason, urlBase }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<ICategoryOption[]>(
    [],
  );

  const handleOpen = async () => {
    setLoading(true);
    const disciplineId = urlBase.split("/")[3];
    const res = await getCategoriesByDisciplineOptions(disciplineId);
    setLoading(false);
    if (!res.error && res.data) {
      setCategoriesOptions(res.data.data);
      setIsOpen(true);
    } else {
      toast.error("Error al cargar las categorías disponibles");
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="secondary"
        className="font-bold text-xs w-full"
        onPress={handleOpen}
        isPending={loading}
      >
        <HugeiconsIcon icon={Add01Icon} size={14} />
        Agregar Categoría
      </Button>

      {isOpen && (
        <DrawerCategory
          teamSeasonId={teamSeason.id}
          categoriesOptions={categoriesOptions}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
