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
import { AddModal } from "@/modules/players";
import { getPlayersOptions, IPlayerOption } from "@/modules/player-memberships";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  playerId: string | null;
  setPlayerId: Dispatch<SetStateAction<string | null>>;
  setSelectedPlayer: Dispatch<SetStateAction<IPlayerOption | null>>;
  errors?: Record<string, string>;
  handleRemoveError?: (fieldName: string) => void;
}

interface ICharacter {
  search: string;
}

export const SelectOrCreatePlayer = ({
  isRequired = true,
  isDisabled = false,
  label,
  playerId,
  setPlayerId,
  setSelectedPlayer,
  errors,
  handleRemoveError,
}: Props) => {
  const list = useAsyncList<IPlayerOption>({
    async load({ cursor: page = "1", filterText, signal }) {
      const res = await getPlayersOptions({ search: filterText, page });
      console.log({ res });
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
        allowsEmptyCollection
        variant="secondary"
        className="flex-1"
        placeholder="Buscar..."
        selectionMode="single"
        value={playerId}
        onChange={(key) => {
          setPlayerId(key?.toString() || "");
          const selectedPlayer = list.items.find((player) => player.id === key);
          if (selectedPlayer) {
            setSelectedPlayer(selectedPlayer);
          }
          handleRemoveError?.("playerId");
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
                  <ListBox.Item id={item.id} textValue={item.person.fullName}>
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="shrink-0" size="sm">
                        <Avatar.Image
                          alt={item.person.fullName}
                          src={item.person.imageUrl ?? undefined}
                        />
                        <Avatar.Fallback>
                          {`${item.person.name[0]}${item.person.lastName[0]}`}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col flex-1">
                        <span className="text-sm font-medium truncate">
                          {item.person.fullName}
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
                  <span className="muted text-sm">Loading more...</span>
                </div>
              </ListBoxLoadMoreItem>
            </ListBox>
          </Autocomplete.Filter>
        </Autocomplete.Popover>
        <FieldError children={errors?.playerId && <p>{errors.playerId}</p>} />
      </Autocomplete>
      <AddModal
        isIcon
        onSubmited={() => {
          list.reload();
        }}
      />
    </div>
  );
};
