"use client";
import {
  FieldError,
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
import { getAvailableCourseStaffOptions, IStaffOption } from "@/modules/course-season-staff";
import { CreateStaffModal } from "@/modules/staff";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  courseSeasonId?: string; // Para excluir a los ya asignados
  staffId: string | null;
  setStaffId: Dispatch<SetStateAction<string | null>>;
  setSelectedStaff?: Dispatch<SetStateAction<IStaffOption | null>>;
  errors: Record<string, string>;
  handleRemoveError?: (fieldName: string) => void;
}

export const SelectOrCreateCourseStaff = ({
  isRequired = true,
  isDisabled = false,
  label,
  courseSeasonId,
  staffId,
  setStaffId,
  setSelectedStaff,
  errors,
  handleRemoveError,
}: Props) => {
  const list = useAsyncList<IStaffOption>({
    async load({ cursor: page = "1", filterText, signal }) {
      const res = await getAvailableCourseStaffOptions({ 
        search: filterText, 
        page, 
        courseSeasonId 
      });
      
      if (!res || res.error) {
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
        allowsEmptyCollection
        variant="secondary"
        className="flex-1"
        placeholder="Buscar por nombre o DNI..."
        selectionMode="single"
        selectedKey={staffId}
        isDisabled={isDisabled}
        onSelectionChange={(key) => {
          const selectedId = key?.toString() || null;
          setStaffId(selectedId);
          if (setSelectedStaff) {
            const selectedItem = list.items.find((item) => item.id === selectedId);
            setSelectedStaff(selectedItem || null);
          }
          if (handleRemoveError) {
            handleRemoveError("staffId");
          }
        }}
      >
        <Label className="text-sm font-semibold">{label}</Label>
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
              renderEmptyState={() => <EmptyState>No se encontró personal disponible</EmptyState>}
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
                        <span className="text-xs text-default-500 truncate">
                          DNI: {item.documentNumber || "N/A"}
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
            const newStaffOption: IStaffOption = {
              id: staff.id,
              personId: staff.person.id,
              name: staff.person.name,
              lastName: staff.person.lastName,
              secondLastName: staff.person.secondLastName,
              fullName: `${staff.person.name} ${staff.person.lastName} ${staff.person.secondLastName || ""}`.trim(),
              documentNumber: staff.person.documentNumber,
              imageUrl: staff.person.imageUrl,
              isActive: staff.isActive,
            };

            list.append(newStaffOption);
            list.setSelectedKeys(new Set([staff.id]));
            setStaffId(staff.id);
            if (setSelectedStaff) setSelectedStaff(newStaffOption);
            if (handleRemoveError) handleRemoveError("staffId");
          }
        }}
      />
    </div>
  );
};
