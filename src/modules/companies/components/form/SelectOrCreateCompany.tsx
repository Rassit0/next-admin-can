"use client";
import {
  Autocomplete,
  Button,
  Input,
  Label,
  ListBox,
  ListBoxLoadMoreItem,
  SearchField,
  Spinner,
  cn,
  FieldError,
  EmptyState,
  Collection,
} from "@heroui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useAsyncList } from "@react-stately/data";
import { AddCompanyModal } from "@/modules/companies/components/modal/AddCompanyModal";
import { getCompaniesOptions, ICompanyOption } from "@/modules/companies";
import { Building01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  companyId: string | null;
  setCompanyId: Dispatch<SetStateAction<string | null>>;
  setSelectedCompany?: Dispatch<SetStateAction<ICompanyOption | null>>;
  errors?: Record<string, string>;
  handleRemoveError?: (fieldName: string) => void;
  defaultCompany?: ICompanyOption | null;
}

export const SelectOrCreateCompany = ({
  isRequired = true,
  isDisabled = false,
  label,
  companyId,
  setCompanyId,
  setSelectedCompany,
  errors,
  handleRemoveError,
  defaultCompany,
}: Props) => {
  const list = useAsyncList<ICompanyOption>({
    async load({ cursor: page = "1", filterText }) {
      const res = await getCompaniesOptions({
        search: filterText,
        page,
      });
      if (!res) {
        return { cursor: undefined, items: [] };
      }
      let items = res.data?.data || [];
      if (defaultCompany) {
        items = items.filter((c) => c.id !== defaultCompany.id);
        if (page === "1" && !filterText) {
          items = [defaultCompany, ...items];
        }
      }
      return {
        cursor: res.data?.meta.nextPage?.toString() || undefined,
        items,
      };
    },
  });

  const uniqueItems = Array.from(
    new Map([
      ...(defaultCompany ? [[defaultCompany.id, defaultCompany] as const] : []),
      ...list.items.map((item) => [item.id, item] as const),
    ]).values(),
  );

  useEffect(() => {
    if (defaultCompany && !companyId) {
      setCompanyId(defaultCompany.id);
      setSelectedCompany?.(defaultCompany);
    }
  }, [defaultCompany, companyId, setCompanyId, setSelectedCompany]);

  return (
    <div className="flex items-end gap-4 w-full">
      <Autocomplete
        aria-label={label}
        isRequired={isRequired}
        allowsEmptyCollection
        isInvalid={!!errors?.companyId || !!errors?.payerCompanyId}
        onOpenChange={() => {
          handleRemoveError?.("companyId");
          handleRemoveError?.("payerCompanyId");
        }}
        isDisabled={isDisabled}
        variant="secondary"
        className="flex-1"
        placeholder="Buscar..."
        selectionMode="single"
        value={companyId}
        onChange={(key) => {
          setCompanyId(key ? key.toString() : null);
          if (setSelectedCompany) {
            const selected = uniqueItems.find((c) => c.id === key);
            setSelectedCompany(selected || null);
          }
        }}
      >
        <Label>{label}</Label>
        <Autocomplete.Trigger>
          <Autocomplete.Value />
          <Autocomplete.ClearButton />
          <Autocomplete.Indicator />
        </Autocomplete.Trigger>
        <Autocomplete.Popover aria-label="Resultados de búsqueda">
          <Autocomplete.Filter
            inputValue={list.filterText}
            onInputChange={list.setFilterText}
          >
            <SearchField
              autoFocus
              aria-label="Buscar empresas"
              className="sticky top-0 z-10"
              name="search"
              variant="secondary"
            >
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input placeholder="Buscar empresa..." />
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
              aria-label="Lista de empresas"
              className="max-h-105 overflow-y-auto"
              items={uniqueItems}
              renderEmptyState={() => (
                <EmptyState>No hay resultados para esta búsqueda.</EmptyState>
              )}
            >
              <Collection items={uniqueItems}>
                {(item) => (
                  <ListBox.Item
                    key={item.id}
                    id={item.id}
                    textValue={item.name}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="shrink-0 flex items-center justify-center h-10 w-10 bg-default-100 rounded-full text-default-500">
                        <HugeiconsIcon icon={Building01Icon} />
                      </div>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium truncate">
                          {item.name}
                        </span>
                        {item.taxId && (
                          <span className="text-xs text-default-500 truncate">
                            NIT: {item.taxId}
                          </span>
                        )}
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
        <FieldError
          children={
            (errors?.companyId || errors?.payerCompanyId) && (
              <p className="text-danger text-xs mt-1">
                {errors.companyId || errors.payerCompanyId}
              </p>
            )
          }
        />
      </Autocomplete>
      {!isDisabled && (
        <AddCompanyModal
          isIcon
          onSubmited={(company) => {
            if (company) {
              list.append(company);
              list.setSelectedKeys(new Set([company.id]));
              setCompanyId(company.id);
              setSelectedCompany?.(company);
            }
          }}
        />
      )}
    </div>
  );
};
