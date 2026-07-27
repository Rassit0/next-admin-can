import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { IShiftOption } from "@/modules/course-seasons";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  shiftsOptions: IShiftOption[];
  shiftId: string | null;
  setShiftId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectShift = ({
  isRequired = true,
  isDisabled = false,
  label,
  shiftsOptions,
  shiftId,
  setShiftId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errors.shiftId || undefined}
      className="w-full"
      name="shiftId"
      value={shiftId}
      onChange={(key) => {
        setShiftId(key?.toString() || "");
        handleRemoveError("shiftId");
      }}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar turno..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {shiftsOptions.map((shift) => (
            <ListBox.Item key={shift.id} id={shift.id} textValue={shift.name}>
              {shift.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </ComboBox.Popover>
      <FieldError children={errors.shiftId && <p>{errors.shiftId}</p>} />
    </ComboBox>
  );
};
