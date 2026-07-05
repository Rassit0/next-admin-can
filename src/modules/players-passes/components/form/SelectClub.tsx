import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { IClubOptionsByDiscipline } from "@/modules/players-passes";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  clubOptions: IClubOptionsByDiscipline[];
  clubId: string | null;
  setClubId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectClub = ({
  isRequired = true,
  isDisabled = false,
  label,
  clubOptions,
  clubId,
  setClubId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errors.clubId || undefined}
      className="w-full"
      name="clubId"
      value={clubId}
      onChange={(key) => {
        setClubId(key?.toString() || "");
        handleRemoveError("clubId");
      }}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar pase..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {clubOptions.map((club) => (
            <ListBox.Item key={club.id} id={club.id} textValue={club.name}>
              {club.name}
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
