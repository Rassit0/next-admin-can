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
  Description,
  Collection,
  ListBoxLoadMoreItem,
  FieldError,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { cn } from "tailwind-variants";

import { ApiError } from "@/utils/api/errors/ApiError";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ICategoryOptions,
  ICategoryOptionsResponse,
} from "../../interfaces/options.ativity.interface";

interface Character {
  name: string;
}

interface Props {
  categoryIds: number[];
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const AutoCompleteCategory = ({
  categoryIds,
  setCategoryIds,
  errors,
  handleRemoveError,
}: Props) => {
  const [categoriesMap, setCategoriesMap] = useState<
    Map<Key, ICategoryOptions>
  >(new Map());

  const selectedCategories = categoryIds
    .map((key) => categoriesMap.get(key))
    .filter((cat): cat is ICategoryOptions => !!cat);

  const list = useAsyncList<ICategoryOptions>({
    async load({ cursor, filterText, signal }) {
      try {
        const params = new URLSearchParams();
        if (filterText) params.set("search", filterText);
        if (cursor) params.set("page", cursor);
        const res = await api.get<ICategoryOptionsResponse>(
          `activities/categories/options?${params.toString()}`,
          {
            signal,
          },
        );
        setCategoriesMap((prev) => {
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
          "Ocurrió un error al obtener las categorias";

        toast.danger(message, { description });

        return { items: [] };
      }
    },
  });

  const onRemoveTags = (keys: Set<Key>) => {
    setCategoryIds((prev) => prev.filter((key) => !keys.has(key)));
  };

  return (
    <Autocomplete
      // allowsEmptyCollection
      // className="w-[256px]"
      isRequired
      aria-label="Seleccionar categorias"
      placeholder="Buscar..."
      selectionMode="multiple"
      variant="secondary"
      value={categoryIds}
      isInvalid={!!errors.categoryIds || undefined}
      onChange={(keys: Key | Key[] | null) => {
        setCategoryIds(keys as number[]);
        handleRemoveError("categoryIds");
      }}
    >
      <Label>CATEGORIAS</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value>
          {({ defaultChildren }: any) => {
            if (selectedCategories.length === 0) return defaultChildren;

            return (
              <TagGroup size="sm" onRemove={onRemoveTags}>
                <TagGroup.List>
                  {/* Aquí ya no habrá duplicados porque vienen de un Map por ID */}
                  {selectedCategories.map((item) => (
                    <Tag className="bg-accent/40" key={item.id} id={item.id}>
                      {item.name}
                    </Tag>
                  ))}
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
              <SearchField.Input placeholder="Buscar categorias..." />
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
          >
            <Collection items={list.items}>
              {(item: ICategoryOptions) => (
                <ListBox.Item id={item.id} textValue={item.name}>
                  <div className="flex flex-col">
                    <Label>{item.name}</Label>
                    <Description>
                      {item.minAge}-{item.maxAge} años
                    </Description>
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
      <FieldError children={errors.categoryIds && <> {errors.categoryIds}</>} />
    </Autocomplete>
  );
};
