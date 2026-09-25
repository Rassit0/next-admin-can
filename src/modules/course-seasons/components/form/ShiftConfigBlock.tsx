import React from "react";
import {
  Card,
  Select,
  ListBox,
  Label,
  FieldError,
  Switch,
  TextField,
  Input,
  Button,
} from "@heroui/react";
import { Delete02Icon, Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Gender,
  ICategoryOption,
  IShiftOption,
} from "@/modules/course-seasons";
import { SelectCategory } from "./SelectCategory";
import { SelectShift } from "./SelectShift";

export interface IShiftConfigForm {
  key: string;
  shiftId: string;
  categoryId: string;
  gender: Gender | null;
  validateAge: boolean;
  minBirthYear: number | null;
  maxBirthYear: number | null;
  minMembers: number;
  maxMembers: number;
}

interface Props {
  index: number;
  shift: IShiftConfigForm;
  categoriesOptions: ICategoryOption[];
  shiftsOptions: IShiftOption[];
  onChange: (index: number, field: keyof IShiftConfigForm, value: any) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
  canRemove: boolean;
}

export const ShiftConfigBlock = ({
  index,
  shift,
  categoriesOptions,
  shiftsOptions,
  onChange,
  onRemove,
  errors,
  canRemove,
}: Props) => {
  const getError = (field: string) => errors[`shift_${index}_${field}`];

  return (
    <Card className="lg:p-6 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] border border-l-4 border-l-primary mb-4">
      <Card.Header className="flex flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <HugeiconsIcon icon={Calendar04Icon} size={18} />
          </div>
          <Card.Title className="font-headline font-bold text-lg">
            Turno #{index + 1}
          </Card.Title>
        </div>
        {canRemove && (
          <Button
            size="sm"
            className="text-danger"
            variant="ghost"
            onPress={() => onRemove(index)}
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
            Eliminar
          </Button>
        )}
      </Card.Header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectShift
          label="Horario / Turno"
          shiftsOptions={shiftsOptions}
          shiftIds={shift.shiftId ? [shift.shiftId] : []}
          setShiftIds={(val) => {
            const arr =
              typeof val === "function"
                ? val(shift.shiftId ? [shift.shiftId] : [])
                : val;
            onChange(index, "shiftId", arr.length > 0 ? arr[0] : "");
          }}
          errors={{ shiftIds: getError("shiftId") }}
          handleRemoveError={() => {}}
          isRequired
          selectionMode="single"
        />

        <SelectCategory
          label="Categoría"
          categoriesOptions={categoriesOptions}
          categoryId={shift.categoryId || null}
          setCategoryId={(val) => {
            const v = typeof val === "function" ? val(shift.categoryId) : val;
            onChange(index, "categoryId", v || "");
          }}
          errors={{ categoryId: getError("categoryId") }}
          handleRemoveError={() => {}}
          isRequired
        />

        <Select
          isRequired
          className="w-full"
          name="gender"
          placeholder="Seleccione un género"
          variant="secondary"
          isInvalid={!!getError("gender") || undefined}
          value={shift.gender || ""}
          onChange={(e) => {
            const selected = e ? (e as Gender) : null;
            onChange(index, "gender", selected);
          }}
        >
          <Label>Rama</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="MALE" textValue="MALE">
                Masculino
              </ListBox.Item>
              <ListBox.Item id="FEMALE" textValue="FEMALE">
                Femenino
              </ListBox.Item>
              <ListBox.Item id="MIXED" textValue="MIXED">
                Mixto
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
          <FieldError
            children={getError("gender") && <>{getError("gender")}</>}
          />
        </Select>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between h-[52px]">
            <Switch
              isSelected={shift.validateAge}
              onChange={(val) => onChange(index, "validateAge", val)}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>Validar edad al inscribir</Switch.Content>
            </Switch>
          </div>
        </div>

        <TextField
          variant="secondary"
          className="w-full"
          name="minBirthYear"
          type="number"
          isInvalid={!!getError("minBirthYear") || undefined}
          isDisabled={!shift.validateAge}
        >
          <Label>Año Nac. Mínimo (Opcional)</Label>
          <Input
            min={1900}
            placeholder="Ej: 2015"
            type="number"
            value={shift.minBirthYear || ""}
            onChange={(e) =>
              onChange(
                index,
                "minBirthYear",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
          <FieldError
            children={
              getError("minBirthYear") && <>{getError("minBirthYear")}</>
            }
          />
        </TextField>

        <TextField
          variant="secondary"
          className="w-full"
          name="maxBirthYear"
          type="number"
          isInvalid={!!getError("maxBirthYear") || undefined}
          isDisabled={!shift.validateAge}
        >
          <Label>Año Nac. Máximo (Opcional)</Label>
          <Input
            min={1900}
            placeholder="Ej: 2016"
            type="number"
            value={shift.maxBirthYear || ""}
            onChange={(e) =>
              onChange(
                index,
                "maxBirthYear",
                e.target.value ? Number(e.target.value) : null,
              )
            }
          />
          <FieldError
            children={
              getError("maxBirthYear") && <>{getError("maxBirthYear")}</>
            }
          />
        </TextField>

        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="minMembers"
          type="number"
          isInvalid={!!getError("minMembers") || undefined}
        >
          <Label>Min. Alumnos</Label>
          <Input
            min={1}
            placeholder="5"
            type="number"
            value={shift.minMembers || ""}
            onChange={(e) =>
              onChange(
                index,
                "minMembers",
                e.target.value ? Number(e.target.value) : "",
              )
            }
          />
          <FieldError
            children={getError("minMembers") && <>{getError("minMembers")}</>}
          />
        </TextField>

        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="maxMembers"
          type="number"
          isInvalid={!!getError("maxMembers") || undefined}
        >
          <Label>Max. Alumnos</Label>
          <Input
            min={1}
            placeholder="20"
            type="number"
            value={shift.maxMembers || ""}
            onChange={(e) =>
              onChange(
                index,
                "maxMembers",
                e.target.value ? Number(e.target.value) : "",
              )
            }
          />
          <FieldError
            children={getError("maxMembers") && <>{getError("maxMembers")}</>}
          />
        </TextField>
      </div>
    </Card>
  );
};
