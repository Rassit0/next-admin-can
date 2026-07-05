import { ComboBox, FieldError, Input, Label, ListBox } from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { ICategoryOption } from "@/modules/team-seasons";

interface Props {
  isRequired?: boolean;
  isDisabled?: boolean;
  label: string;
  categoriesOptions: ICategoryOption[];
  categoryId: string | null;
  setCategoryId: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

export const SelectCategory = ({
  isRequired = true,
  isDisabled = false,
  label,
  categoriesOptions,
  categoryId,
  setCategoryId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <ComboBox
      variant="secondary"
      isRequired={isRequired}
      isDisabled={isDisabled}
      isInvalid={!!errors.categoryId || undefined}
      className="w-full"
      name="categoryId"
      value={categoryId}
      onChange={(key) => {
        setCategoryId(key?.toString() || "");
        handleRemoveError("categoryId");
      }}
    >
      <Label>{label}</Label>
      <ComboBox.InputGroup>
        <Input placeholder="Buscar pase..." />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ListBox>
          {categoriesOptions.map((category) => (
            <ListBox.Item
              key={category.id}
              id={category.id}
              textValue={category.name}
            >
              {category.name}
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
