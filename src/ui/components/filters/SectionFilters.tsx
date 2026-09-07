import { Filters, PerPage } from "@/ui";

interface SectionFiltersProps {
  actions?: React.ReactNode; // Para el botón de "Agregar"
  children?: React.ReactNode; // Para los filtros (search, selects)
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export const SectionFilters = ({ actions, children, showSearch, searchPlaceholder }: SectionFiltersProps) => {
  return (
    <div className="flex flex-wrap flex-row gap-2 justify-between items-end w-full">
      {/* Contenedor izquierdo: Search + Filtros */}
      <div className="flex flex-wrap flex-1 gap-2 items-center">
        <Filters showSearch={showSearch} searchPlaceholder={searchPlaceholder}>{children}</Filters>
        <PerPage />
      </div>

      {/* Contenedor derecho: Acciones (Botones) */}
      <div className="flex flex-wrap gap-2">{actions}</div>
    </div>
  );
};
