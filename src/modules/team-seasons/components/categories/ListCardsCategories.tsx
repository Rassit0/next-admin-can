"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { CardCategory } from "./CardCategory";
import { DrawerCategory } from "./DrawerCategory";
import { ICategoryOption, ITeamSeasonCategory } from "@/modules/team-seasons";

interface Props {
  teamSeasonId: string;
  categories: ITeamSeasonCategory[];
  categoriesOptions: ICategoryOption[];
}

export const ListCardsCategories = ({
  teamSeasonId,
  categories,
  categoriesOptions,
}: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ITeamSeasonCategory | undefined>();

  const handleOpenAdd = () => {
    setSelectedCategory(undefined);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (category: ITeamSeasonCategory) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-headline font-bold text-foreground">
            Categorías Deportivas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona las categorías, géneros y límites de edades para esta temporada.
          </p>
        </div>
          <button
            type="button"
            className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            onClick={handleOpenAdd}
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            Añadir
          </button>
      </div>

      {categories.length === 0 ? (
        <div className="w-full p-8 border border-dashed border-border rounded-xl flex flex-col items-center justify-center text-center bg-surface-container-lowest">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
            <HugeiconsIcon icon={Add01Icon} size={24} />
          </div>
          <p className="font-semibold text-foreground">Aún no hay categorías</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Agrega una o más categorías deportivas para permitir inscripciones en esta temporada.
          </p>
          <button
            type="button"
            className="mt-4 px-4 py-2 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary-soft transition-colors inline-flex items-center gap-2"
            onClick={handleOpenAdd}
          >
            <HugeiconsIcon icon={Add01Icon} size={20} />
            Añadir Categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CardCategory
              key={category.id}
              teamSeasonId={teamSeasonId}
              category={category}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      <DrawerCategory
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        teamSeasonId={teamSeasonId}
        category={selectedCategory}
        categoriesOptions={categoriesOptions}
      />
    </div>
  );
};
