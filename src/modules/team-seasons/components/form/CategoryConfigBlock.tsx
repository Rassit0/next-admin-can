import {
  Card,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  Switch,
  TextField,
  Button,
} from "@heroui/react";
import { Delete02Icon, Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Gender, ICategoryOption } from "@/modules/team-seasons";
import { SelectCategory } from "@/modules/course-seasons/components/form/SelectCategory"; // Reusing CourseSeason's SelectCategory

export interface ICategoryConfigForm {
  key: string;
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
  category: ICategoryConfigForm;
  categoriesOptions: ICategoryOption[];
  onChange: (
    index: number,
    field: keyof ICategoryConfigForm,
    value: any,
  ) => void;
  onRemove: (index: number) => void;
  errors: Record<string, string>;
  canRemove: boolean;
}

export const CategoryConfigBlock = ({
  index,
  category,
  categoriesOptions,
  onChange,
  onRemove,
  errors,
  canRemove,
}: Props) => {
  const getError = (field: string) => errors[`category_${index}_${field}`];

  return (
    <Card className="lg:p-6 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] border border-l-4 border-l-primary mb-4">
      <Card.Header className="flex flex-row justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <HugeiconsIcon icon={Calendar04Icon} size={18} />
          </div>
          <Card.Title className="font-headline font-bold text-lg">
            Configuración #{index + 1}
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
        <SelectCategory
          label="Categoría"
          categoriesOptions={categoriesOptions}
          categoryId={category.categoryId || null}
          setCategoryId={(val) => {
            const v =
              typeof val === "function" ? val(category.categoryId) : val;
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
          value={category.gender || ""}
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
          <div className="flex items-center justify-between h-13">
            <Switch
              isSelected={category.validateAge}
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
          isDisabled={!category.validateAge}
        >
          <Label>Año Nac. Mínimo (Opcional)</Label>
          <Input
            min={1900}
            placeholder="Ej: 2015"
            type="number"
            value={category.minBirthYear || ""}
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
          isDisabled={!category.validateAge}
        >
          <Label>Año Nac. Máximo (Opcional)</Label>
          <Input
            min={1900}
            placeholder="Ej: 2016"
            type="number"
            value={category.maxBirthYear || ""}
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
            value={category.minMembers || ""}
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
            value={category.maxMembers || ""}
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
