import { Filters, PerPage } from "@/ui";

interface SectionFiltersProps {
  actions?: React.ReactNode; // Para el botón de "Agregar"
  children?: React.ReactNode; // Para los filtros (search, selects)
}

export const SectionFilters = ({ actions, children }: SectionFiltersProps) => {
  return (
    <div className="flex flex-wrap flex-row gap-2 justify-between items-end w-full">
      {/* Contenedor izquierdo: Search + Filtros */}
      <div className="flex flex-1 gap-1 md:gap-2 items-center">
        <Filters>{children}</Filters>
        <PerPage />
      </div>

      {/* Contenedor derecho: Acciones (Botones) */}
      <div className="flex gap-2">{actions}</div>
    </div>
  );
};
