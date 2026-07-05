import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { ISeasonOption } from "@/modules/team-seasons";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  seasonsOptions: ISeasonOption[];
  seasonId: string | null;
  setSeasonId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectSeason = ({
  isRequired = true,
  isDisabled = false,
  label,
  seasonsOptions,
  seasonId,
  setSeasonId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errors.seasonId || undefined}
      className="w-full"
      name="seasonId"
      value={seasonId}
      onChange={(key) => {
        setSeasonId(key?.toString() || "");
        handleRemoveError("seasonId");
      }}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar pase..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {seasonsOptions.map((season) => (
            <ListBox.Item
              key={season.id}
              id={season.id}
              textValue={season.name}
            >
              <div className="flex flex-col">
                {season.name}
                <span className="text-xs text-gray-500">
                  {season.startDate.toLocaleDateString()} -{" "}
                  {season.endDate.toLocaleDateString()}
                </span>
              </div>
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
      <FieldError
        children={errors.currentTeamId && <p>{errors.currentTeamId}</p>}
      />
    </ComboBox>
  );
};
