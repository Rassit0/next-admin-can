"use client";
import { Label, SearchField } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, memo, useCallback, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";

interface FiltersProps {
  showSearch?: boolean;
  searchPlaceholder?: string; // Opcional: para cambiar el texto rápido
  children?: React.ReactNode;
}

export const Filters = ({
  showSearch = true, // Por defecto true, para no tener que escribirlo siempre
  searchPlaceholder = "Busar...",
  children,
}: FiltersProps) => {
  const router = useRouter();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleUrlUpdate = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", "1"); // Reset a página 1

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  // 4. onChange maneja ambos estados
  const handleChange = (value: string) => {
    setSearch(value); // Actualiza el input inmediatamente
    handleUrlUpdate(value); // Debounce para la URL
  };

  return (
    <div className="flex gap-4 items-center w-full">
      {/* Si showSearch es true, renderiza el estándar */}
      {showSearch && (
        <SearchField
          name="search"
          className="w-full max-w-md"
          variant="secondary"
          value={search}
          onChange={handleChange}
        >
          <Label>Buscar</Label>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder={searchPlaceholder} />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>
      )}

      {/* El resto de filtros personalizados */}
      {children}
    </div>
  );
};
