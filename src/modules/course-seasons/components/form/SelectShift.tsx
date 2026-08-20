import { FieldError, Label, ListBox, Select } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { IShiftOption } from "@/modules/course-seasons";
import { AddModal } from "@/modules/shifts/components/modal/AddModal";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  shiftsOptions: IShiftOption[];
  shiftIds: string[];
  setShiftIds: Dispatch<SetStateAction<string[]>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
  selectionMode?: "single" | "multiple";
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
  selectionMode = "multiple",
}: Props) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex w-full items-center justify-between">
        <Label>{label}</Label>
        <AddModal isIcon label="Nuevo turno" />
      </div>
      <Select
        variant="secondary"
        isRequired={isRequired}
        isDisabled={isDisabled}
        isInvalid={!!errors.shiftIds || undefined}
        className="w-full"
        name="shiftIds"
        selectionMode={selectionMode}
        value={selectionMode === "multiple" ? shiftIds : shiftIds[0] || ""}
        onChange={(e) => {
          if (!e) {
            setShiftIds([]);
          } else if (Array.isArray(e)) {
            setShiftIds(e.map(String));
          } else {
            setShiftIds([String(e)]);
          }
          handleRemoveError("shiftIds");
        }}
      >
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
    </div>
  );
};
