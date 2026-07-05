import { api } from "@/utils/api";
import {
  Label,
  Autocomplete,
  SearchField,
  Spinner,
  ListBox,
  EmptyState,
  toast,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { cn } from "tailwind-variants";
import { ApiError } from "@/utils/api/errors/ApiError";
import {
  IActivitiesOptionsResponse,
  IActivityOptions,
} from "@/modules/activities";

interface Props {
  parentId: number | null;
  setParentId: (value: number | null) => void;
  organizationId: number;
}

export const AutoCompleteActivity = ({
  parentId,
  setParentId,
  organizationId,
}: Props) => {
  const list = useAsyncList<IActivityOptions>({
    async load({ cursor, filterText, signal }) {
      try {
        const params = new URLSearchParams();
        if (filterText) params.set("search", filterText);
        if (cursor) params.set("page", cursor);
        params.set("organizationId", organizationId.toString());
        const res = await api.get<IActivitiesOptionsResponse>(
          `activities/options?${params.toString()}`,
          {
            signal,
          },
        );
        return {
          cursor: res.meta.nextPage?.toString() || undefined,
          items: res.data,
        };
      } catch (error: any) {
        console.log("error activitr", error);
        // toast.danger("asdf");
        if (signal.aborted) return { items: [] }; // Si la petición fue cancelada, no hacemos nada

        // 2. Manejo de errores limpio (un solo toast)
        const isApiError = error instanceof ApiError;
        const message = isApiError ? error.message : "Error inesperado";
        const description =
          error.errors && Array.isArray(error.errors)
            ? error.errors.join(", ")
            : "Ocurrió un error al obtener las actividades";

        toast.danger(message, { description });

        return { items: [] };
      }
    },
  });
  return (
    <Autocomplete
      allowsEmptyCollection
      aria-label="Seleccionar actividad"
      // className="w-[256px]"
      placeholder="Buscar..."
      selectionMode="single"
      variant="secondary"
      value={parentId}
      onChange={(keys) => setParentId(keys as number)}
    >
      <Label>ACTIVIDADES</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton type="button" />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter
          inputValue={list.filterText}
          onInputChange={list.setFilterText}
        >
          <SearchField
            autoFocus
            className="sticky top-0 z-10"
            name="search"
            variant="secondary"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Buscar actividades..." />
              <Spinner
                size="sm"
                className={cn("absolute top-1/2 right-2 -translate-y-1/2", {
                  "pointer-events-none opacity-0": !list.isLoading,
                })}
              />
              <SearchField.ClearButton
                className={cn({
                  "pointer-events-none opacity-0": !!list.isLoading,
                })}
              />
            </SearchField.Group>
          </SearchField>
          <ListBox
            className="max-h-105 overflow-y-auto"
            items={list.items}
            renderEmptyState={() => <EmptyState>No results found</EmptyState>}
          >
            {(item: IActivityOptions) => (
              <ListBox.Item id={item.id} textValue={item.id.toString()}>
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
    </Autocomplete>
  );
};
