import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import {
  IPlayerPassActiveOptions,
  ITeamsByClubOptions,
} from "@/modules/players-passes";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  teamsOptions: ITeamsByClubOptions[];
  currentTeamId: string | null;
  setCurrentTeamId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectTeam = ({
  isRequired = true,
  isDisabled = false,
  label,
  teamsOptions,
  currentTeamId,
  setCurrentTeamId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errors.currentTeamId || undefined}
      className="w-full"
      name="currentTeamId"
      selectedKey={currentTeamId}
      onSelectionChange={(key) => {
        setCurrentTeamId(key?.toString() || "");
        handleRemoveError("currentTeamId");
      }}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar equipo..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {teamsOptions.map((team) => (
            <ListBox.Item key={team.id} id={team.id} textValue={team.name}>
              {team.name}
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
