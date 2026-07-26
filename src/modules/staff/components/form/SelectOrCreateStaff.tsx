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
import { Dispatch, SetStateAction } from "react";
import { useAsyncList } from "@react-stately/data";
import { getStaff, IStaff } from "@/modules/staff";
import { CreateStaffModal } from "@/modules/staff/components/modal/CreateStaffModal";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  staffId: string | null;
  setStaffId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectOrCreateStaff = ({
  isRequired = true,
  isDisabled = false,
  label,
  staffId,
  setStaffId,
  errors,
  handleRemoveError,
}: Props) => {
  const list = useAsyncList<IStaff>({
    async load({ cursor: page = "1", filterText, signal }) {
      const res = await getStaff({ search: filterText, page });
      if (!res || !res.data) {
        return {
          cursor: undefined,
          items: [],
        };
      }
      return {
        cursor: res.data.meta?.nextPage?.toString() || undefined,
        items: res.data.data || [],
      };
    },
  });

  return (
    <div className="flex items-end gap-4 w-full">
      <Autocomplete
        allowsEmptyCollection
        variant="secondary"
        className="flex-1"
        placeholder="Buscar..."
        selectionMode="single"
        value={staffId}
        onChange={(key) => {
          setStaffId(key?.toString() || "");
          handleRemoveError("staffId");
        }}
        isDisabled={isDisabled}
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
              aria-label="Buscar personal"
              className="sticky top-0 z-10"
              name="search"
              variant="secondary"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Buscar personal..." />
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
              aria-label="Lista de personal"
              className="max-h-105 overflow-y-auto"
              items={list.items}
              renderEmptyState={() => <EmptyState>No se encontraron resultados</EmptyState>}
            >
              <Collection items={list.items}>
                {(item) => (
                  <ListBox.Item id={item.id} textValue={`${item.person.name} ${item.person.lastName}`}>
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="shrink-0" size="sm">
                        <Avatar.Image
                          alt={`${item.person.name} ${item.person.lastName}`}
                          src={item.person.imageUrl ?? undefined}
                        />
                        <Avatar.Fallback>
                          {`${item.person.name[0]}${item.person.lastName[0]}`}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium truncate">
                          {item.person.name} {item.person.lastName} {item.person.secondLastName || ''}
                        </span>
                        <span className="text-xs text-default-500 truncate">
                          DNI: {item.person.documentNumber}
                        </span>
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
                  <span className="muted text-sm">Cargando más...</span>
                </div>
              </ListBoxLoadMoreItem>
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
        <FieldError children={errors.staffId && <p>{errors.staffId}</p>} />
      </Autocomplete>
      <CreateStaffModal
        isIcon
        onSubmited={(staff) => {
          if (staff) {
            list.append(staff);
            list.setSelectedKeys(new Set([staff.id]));
            setStaffId(staff.id);
          }
        }}
      />
    </div>
  );
};
