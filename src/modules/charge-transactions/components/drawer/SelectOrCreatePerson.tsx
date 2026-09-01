"use client";
import {
  ComboBox,
  FieldError,
  Input,
  Label,
  ListBox,
  SearchField,
  Autocomplete,
  Spinner,
  cn,
  EmptyState,
  ListBoxLoadMoreItem,
  Collection,
  Avatar,
} from "@heroui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAsyncList } from "@react-stately/data";
import {
  getPersonsOptions,
  IPersonOption,
} from "@/modules/charge-transactions";
import { AddModal } from "@/modules/persons";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  personId: string | null;
  setPersonId: Dispatch<SetStateAction<string | null>>;
  setSelectedPerson: Dispatch<SetStateAction<IPersonOption | null>>;
  errors?: Record<string, string>;
  handleRemoveError?: (fieldName: string) => void;
  defaultPerson?: IPersonOption | null;
}

interface ICharacter {
  search: string;
}

const calculateAge = (birthDateString: Date | string | null) => {
  if (!birthDateString) return null;
  const birthDate = new Date(birthDateString);
  const today = new Date();
  return today.getFullYear() - birthDate.getFullYear();
};

export const SelectOrCreatePerson = ({
  isRequired = true,
  isDisabled = false,
  label,
  personId,
  setPersonId,
  setSelectedPerson,
  errors,
  handleRemoveError,
  defaultPerson,
}: Props) => {
  const list = useAsyncList<IPersonOption>({
    async load({ cursor: page = "1", filterText, signal }) {
      const res = await getPersonsOptions({ search: filterText, page });
      console.log({ res });
      if (!res) {
        return {
          cursor: undefined,
          items: [],
        };
      }
      let items = res.data?.data || [];
      if (defaultPerson && page === "1" && !filterText) {
        const exists = items.find(p => p.id === defaultPerson.id);
        if (!exists) {
          items = [defaultPerson, ...items];
        }
      }

      return {
        cursor: res.data?.meta.nextPage?.toString() || undefined,
        items,
      };
    },
  });
  
  useEffect(() => {
    if (defaultPerson && !personId) {
      setPersonId(defaultPerson.id);
      setSelectedPerson(defaultPerson);
    }
  }, [defaultPerson, personId, setPersonId, setSelectedPerson]);

  return (
    <div className="flex items-end gap-4 w-full">
      <Autocomplete
        isRequired={isRequired}
        allowsEmptyCollection
        variant="secondary"
        className="flex-1"
        placeholder="Buscar..."
        selectionMode="single"
        value={personId}
        onChange={(key) => {
          setPersonId(key?.toString() || "");
          const selectedPlayer = list.items.find((player) => player.id === key);
          if (selectedPlayer) {
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
              aria-label="Buscar jugadores"
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
              renderEmptyState={() => <EmptyState>No results found</EmptyState>}
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
                              • Edad deportiva: {calculateAge(item.birthDate)}{" "}
                              años
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
                  <span className="muted text-sm">Loading more...</span>
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
            // Agregar la playera a la lista localmente para que se pueda seleccionar
            list.append({
              id: person.id,
              name: person.name,
              lastName: person.lastName,
              secondLastName: person.secondLastName,
              documentNumber: person.documentNumber,
              gender: person.gender,
              birthDate: person.birthDate,
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
