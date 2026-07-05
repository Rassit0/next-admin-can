"use client";
import { api } from "@/utils/api";
import {
  Label,
  Autocomplete,
  SearchField,
  Spinner,
  ListBox,
  EmptyState,
  toast,
  Key,
  TagGroup,
  Tag,
  Collection,
  ListBoxLoadMoreItem,
  FieldError,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { cn } from "tailwind-variants";
import { ApiError } from "@/utils/api/errors/ApiError";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap } from "@/utils";
import {
  IDisciplineOptions,
  IDisciplineOptionsResponse,
} from "@/modules/organizations";

interface Props {
  isRequired?: boolean;
  disciplineIds: number[];
  setDisciplineIds: Dispatch<SetStateAction<number[]>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const AutoCompleteDiscipline = ({
  isRequired,
  disciplineIds,
  setDisciplineIds,
  errors,
  handleRemoveError,
}: Props) => {
  const [disciplinesMap, setDisciplinesMap] = useState<
    Map<Key, IDisciplineOptions>
  >(new Map());

  const selectedDisciplines = disciplineIds
    .map((key) => disciplinesMap.get(key))
    .filter((cat): cat is IDisciplineOptions => !!cat);

  const list = useAsyncList<IDisciplineOptions>({
    async load({ cursor, filterText, signal }) {
      try {
        const params = new URLSearchParams();
        if (filterText) params.set("search", filterText);
        if (cursor) params.set("page", cursor);
        const res = await api.get<IDisciplineOptionsResponse>(
          `activities/disciplines/options?${params.toString()}`,
          {
            signal,
          },
        );

        // Actualizamos el mapa con los nuevos datos
        setDisciplinesMap((prev) => {
          // Creamos una copia del mapa actual (inmutabilidad)
          const newMap = new Map(prev);
          // Agregamos los nuevos elementos que llegaron de la API
          res.data.forEach((item) => {
            newMap.set(item.id, item);
          });
          return newMap;
        });

        return {
          cursor: res.meta.nextPage?.toString() || undefined,
          items: res.data,
        };
      } catch (error: any) {
        console.log(error);
        if (signal.aborted) return { items: [] };

        // 2. Manejo de errores limpio (un solo toast)
        const isApiError = error instanceof ApiError;
        const message = isApiError ? error.message : "Error inesperado";
        const description =
          error.errors?.join(", ") ||
          "Ocurrió un error al obtener las disciplinas";

        toast.danger(message, { description });

        return { items: [] };
      }
    },
  });

  const onRemoveTags = (keys: Set<Key>) => {
    setDisciplineIds((prev) => prev.filter((key) => !keys.has(key)));
  };

  return (
    <Autocomplete
      // allowsEmptyCollection
      // className="w-[256px]"
      isRequired={isRequired}
      aria-label="Seleccionar disciplinas"
      placeholder="Buscar..."
      selectionMode="multiple"
      // variant="secondary"
      isInvalid={!!errors.disciplineIds || undefined}
      value={disciplineIds}
      onChange={(keys: Key | Key[] | null) => {
        setDisciplineIds(keys as number[]);
        handleRemoveError("disciplineIds");
      }}
    >
      <Label>DISCIPLINAS</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value>
          {({ defaultChildren }: any) => {
            if (selectedDisciplines.length === 0) {
              return defaultChildren;
            }
            return (
              <TagGroup size="sm" onRemove={onRemoveTags}>
                <TagGroup.List>
                  {selectedDisciplines.map((item: IDisciplineOptions) => {
                    return (
                      <Tag className="bg-accent/40" key={item.id} id={item.id}>
                        {item.name}
                      </Tag>
                    );
                  })}
                </TagGroup.List>
              </TagGroup>
            );
          }}
        </Autocomplete.Value>
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
              <SearchField.Input placeholder="Buscar disciplinas..." />
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
            // items={list.items}
            // renderEmptyState={() => <EmptyState>No results found</EmptyState>}
            aria-label="Lista de disciplinas"
          >
            <Collection items={list.items}>
              {(item: IDisciplineOptions) => (
                <ListBox.Item id={item.id} textValue={item.name}>
                  <HugeiconsIcon icon={iconMap[item.icon]} />
                  <div className="flex flex-col">
                    <Label>{item.name}</Label>
                  </div>
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              )}
            </Collection>
            <ListBoxLoadMoreItem
              isLoading={list.loadingState === "loadingMore"}
              onLoadMore={list.loadMore}
            >
              <div className="flex items-center justify-center gap-2 py-2">
                <Spinner size="sm" />
                <span className="text-sm text-muted">Loading more...</span>
              </div>
            </ListBoxLoadMoreItem>
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
      <FieldError
        children={errors.disciplineIds && <> {errors.disciplineIds}</>}
      />
    </Autocomplete>
  );
};
