import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { IShiftOption } from "@/modules/course-seasons";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  shiftsOptions: IShiftOption[];
  shiftIds: string[];
  setShiftIds: Dispatch<SetStateAction<string[]>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectShift = ({
  isRequired = true,
  isDisabled = false,
  label,
  shiftsOptions,
  shiftIds,
  setShiftIds,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Select
      variant="secondary"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errors.shiftIds || undefined}
      className="w-full"
      name="shiftIds"
      selectionMode="multiple"
      value={shiftIds}
      onChange={(keys: any) => {
        setShiftIds(Array.from(keys) as string[]);
        handleRemoveError("shiftIds");
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {shiftsOptions.map((shift) => (
            <ListBox.Item key={shift.id} id={shift.id} textValue={shift.name}>
              {shift.name}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      <FieldError children={errors.shiftIds && <p>{errors.shiftIds}</p>} />
    </Select>
  );
};
