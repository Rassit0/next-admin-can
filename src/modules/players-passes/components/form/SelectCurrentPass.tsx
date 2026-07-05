import {
  ComboBox,
  FieldError,
  Input,
  InputGroup,
  Label,
  ListBox,
} from "@heroui/react";
import { IPlayerPassActiveOptions } from "@/modules/players-passes";
import { Dispatch, SetStateAction } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap } from "@/utils";

interface Props {
  activePassesOptions: IPlayerPassActiveOptions[];
  currentPassId: string | null;
  setCurrentPassId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
  isRequired?: boolean;
}

export const SelectCurrentPass = ({
  activePassesOptions,
  currentPassId,
  setCurrentPassId,
  errors,
  handleRemoveError,
  isRequired = false,
}: Props) => {
  const currentPass = activePassesOptions.find(
    (pass) => pass.id === currentPassId,
  );
  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isInvalid={!!errors.currentPassId || undefined}
      className="w-full"
      name="currentPassId"
      selectedKey={currentPassId}
      onSelectionChange={(key) => {
        setCurrentPassId(key?.toString() || "");
        handleRemoveError("currentTeamId");
      }}
    >
      <Label>Pase actual</Label>
      <ComboBox.InputGroup className="gap-2">
        {currentPass && (
          <InputGroup.Prefix>
            <HugeiconsIcon
              icon={iconMap[currentPass.currentTeam.club.discipline.icon]}
            />
          </InputGroup.Prefix>
        )}
        <Input placeholder="Buscar pase..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {activePassesOptions.map((pass) => (
            <ListBox.Item
              key={pass.id}
              id={pass.id}
              textValue={`${pass.currentTeam.club.name} - ${pass.currentTeam.name}`}
            >
              <HugeiconsIcon
                icon={iconMap[pass.currentTeam.club.discipline.icon]}
              />
              Pase Activo - {pass.currentTeam.club.name}{" "}
              {`(${pass.currentTeam.name})`}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
      <FieldError
        children={errors.currentPassId && <p>{errors.currentPassId}</p>}
      />
    </ComboBox>
  );
};
