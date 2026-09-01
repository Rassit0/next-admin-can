"use client";
import {
  Autocomplete,
  FieldError,
  Label,
  ListBox,
  SearchField,
  Spinner,
  cn,
  EmptyState,
  ListBoxLoadMoreItem,
  Collection,
  Avatar,
} from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { useAsyncList } from "@react-stately/data";
import { getPersonsOptions, IPersonOption } from "../../actions/get-persons-options";
import { AddModal } from "@/modules/persons";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  personId: string | null;
  setPersonId: Dispatch<SetStateAction<string | null>>;
  setSelectedPerson?: Dispatch<SetStateAction<IPersonOption | null>>;
  errors?: Record<string, string>;
  handleRemoveError?: (fieldName: string) => void;
  // This helps when we want to use the legacy fetch action from a specific module, or the unified one.
  fetchOptionsAction?: typeof getPersonsOptions;
}

const calculateAge = (birthDateString: Date | string | null) => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear();
};

export const PersonAutocomplete = ({
  isRequired = true,
  isDisabled = false,
  label,
  personId,
  setPersonId,
  setSelectedPerson,
  errors,
  handleRemoveError,
  fetchOptionsAction = getPersonsOptions,
}: Props) => {
  const list = useAsyncList<IPersonOption>({
    async load({ cursor: page = "1", filterText, signal }) {
      const res = await fetchOptionsAction({ search: filterText, page }, signal);
      if (!res) {
        return {
          cursor: undefined,
          items: [],
        };
      }
      return {
        cursor: res.data?.meta.nextPage?.toString() || undefined,
        items: res.data?.data || [],
      };
    },
  });

  return (
    <div className="flex items-end gap-4 w-full">
      <Autocomplete
        isRequired={isRequired}
        isDisabled={isDisabled}
        allowsEmptyCollection
        variant="secondary"
        className="flex-1"
        placeholder="Buscar..."
        selectionMode="single"
        value={personId}
        onChange={(key) => {
          setPersonId(key?.toString() || "");
          const selectedPlayer = list.items.find((player) => player.id === key);
          if (selectedPlayer && setSelectedPerson) {
            setSelectedPerson(selectedPlayer);
          }
          handleRemoveError?.("personId");
        }}
      >
        <Label>{label}</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover>
          <Autocomplete.Filter
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
          >
            <SearchField
              autoFocus
              aria-label="Buscar personas"
              className="sticky top-0 z-10"
              name="search"
              variant="secondary"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Buscar..." />
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
              aria-label="Lista de personas"
              className="max-h-105 overflow-y-auto"
              items={list.items}
              renderEmptyState={() => <EmptyState>No se encontraron resultados</EmptyState>}
            >
              <Collection items={list.items}>
                {(item) => (
                  <ListBox.Item id={item.id} textValue={item.fullName}>
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="shrink-0" size="sm">
                        <Avatar.Image
                          alt={item.fullName}
                          src={item.imageUrl ?? undefined}
                        />
                        <Avatar.Fallback>
                          {`${item.name[0]}${item.lastName[0]}`}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium truncate">
                          {item.fullName}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-default-500 truncate">
                            DNI: {item.documentNumber}
                          </span>
                          {item.birthDate && (
                            <span className="text-xs text-default-500 truncate">
                              • Edad: {calculateAge(item.birthDate)} años
                            </span>
                          )}
                        </div>
                      </div>
                      <ListBox.ItemIndicator />
                    </div>
                  </ListBox.Item>
                )}
              </Collection>
              <ListBoxLoadMoreItem
                isLoading={list.loadingState === "loadingMore"}
                onLoadMore={list.loadMore}
              >
                <div className="flex items-center justify-center gap-2 py-2">
                  <Spinner size="sm" />
                  <span className="text-default-500 text-sm">Cargando más...</span>
                </div>
              </ListBoxLoadMoreItem>
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
        <FieldError children={errors?.personId && <p>{errors.personId}</p>} />
      </Autocomplete>
      <AddModal
        isIcon
        onSubmited={(person) => {
          if (person) {
            list.append({
              id: person.id,
              name: person.name,
              lastName: person.lastName,
              secondLastName: person.secondLastName,
              documentNumber: person.documentNumber || "",
              gender: person.gender || "",
              birthDate: person.birthDate ? new Date(person.birthDate) : null,
              imageUrl: person.imageUrl,
              fullName: `${person.name} ${person.lastName}`,
            });
            list.setSelectedKeys(new Set([person.id]));
            setPersonId(person.id);
          }
        }}
      />
    </div>
  );
};
