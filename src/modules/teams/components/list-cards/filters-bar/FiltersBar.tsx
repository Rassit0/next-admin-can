import { Card } from "@heroui/react";
import { FilterIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const FiltersBar = () => {
  return (
    <Card className="p-4 flex flex-row flex-wrap items-center gap-4">
      <Card
        variant="tertiary"
        className="flex flex-row items-center gap-2 px-4 py-2"
      >
        <HugeiconsIcon icon={FilterIcon} />
        <span className="text-xs font-bold">Filtrar por:</span>
      </Card>
      <select className="bg-transparent border-none text-sm font-semibold text-on-surface focus:ring-0 cursor-pointer hover:text-primary transition-colors">
        <option>Todas las Disciplinas</option>
        <option>Fútbol</option>
        <option>Baloncesto</option>
        <option>Voleibol</option>
      </select>
      <div className="h-4 w-px bg-slate-300"></div>
      <select className="bg-transparent border-none text-sm font-semibold text-on-surface focus:ring-0 cursor-pointer hover:text-primary transition-colors">
        <option>Estado: Activas</option>
        <option>Estado: Inactivas</option>
        <option>Ver todas</option>
      </select>
    </Card>
  );
};
