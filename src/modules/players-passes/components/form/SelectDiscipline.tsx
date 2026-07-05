import {
  ComboBox,
  FieldError,
  Input,
  InputGroup,
  Label,
  ListBox,
} from "@heroui/react";
import { IDisciplineOptions } from "@/modules/players-passes";
import { Dispatch, SetStateAction } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { iconMap } from "@/utils";

interface Props {
  isRequired?: boolean;
  disciplineOptions: IDisciplineOptions[];
  disciplineId: string | null;
  setDisciplineId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectDiscipline = ({
  isRequired = true,
  disciplineOptions,
  disciplineId,
  setDisciplineId,
  errors,
  handleRemoveError,
}: Props) => {
  const currentDiscipline = disciplineOptions.find(
    (discipline) => discipline.id === disciplineId,
  );

  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isInvalid={!!errors.disciplineId || undefined}
      className="w-full"
      name="disciplineId"
      selectedKey={disciplineId}
      onSelectionChange={(key) => {
        setDisciplineId(key?.toString() || "");
        handleRemoveError("disciplineId");
      }}
    >
      <Label>DISCIPLINA DE REGISTRO</Label>
      <ComboBox.InputGroup className="gap-2">
        {currentDiscipline && (
          <InputGroup.Prefix>
            <HugeiconsIcon icon={iconMap[currentDiscipline.icon]} />
          </InputGroup.Prefix>
        )}
        <Input placeholder="Buscar pase..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {disciplineOptions.map((discipline) => (
            <ListBox.Item
              key={discipline.id}
              id={discipline.id}
              textValue={discipline.name}
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={iconMap[discipline.icon]} />
                {discipline.name}
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
