import {
  Card,
  FieldError,
  Input,
  Label,
  TextField,
  Select,
  ListBox,
} from "@heroui/react";
import {
  Calendar04Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ActivitySkillLevel,
  ActivityStatus,
  ActivityType,
} from "../../interfaces/activity.interface";
import { AutoCompleteActivity } from "./AutoCompleteActivity";
import { DateRangePickerDiscipline } from "./DateRangePickerDiscipline";
import { AddEducationalActivityProps } from "../../interfaces/post.activity,interface";
import { Dispatch, SetStateAction } from "react";

interface Props {
  organizationId: number;
  name: string;
  setName: (value: string) => void;
  level: ActivitySkillLevel;
  setLevel: Dispatch<SetStateAction<ActivitySkillLevel>>;
  maxMembers: number;
  setMaxMembers: Dispatch<SetStateAction<number>>;
  minMembers: number;
  setMinMembers: Dispatch<SetStateAction<number>>;
  staffRequired: number;
  setStaffRequired: Dispatch<SetStateAction<number>>;
  parentId?: number | null;
  setParentId?: Dispatch<SetStateAction<number | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}

const disciplines: { id: ActivitySkillLevel; name: string }[] = [
  { id: "NA", name: "No Aplica" },
  { id: "BEGINNER", name: "Principiante" },
  { id: "INTERMEDIATE", name: "Intermedio" },
  { id: "ADVANCED", name: "Avanzado" },
  { id: "ELITE", name: "Elite" },
];

export const InfoBasic = ({
  organizationId,
  name,
  setName,
  level,
  setLevel,
  maxMembers,
  setMaxMembers,
  minMembers,
  setMinMembers,
  staffRequired,
  setStaffRequired,
  parentId,
  setParentId,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="col-span-12 p-8 border-l-4 border-blue-900">
      <div className="flex items-center gap-4 mb-2">
        <HugeiconsIcon
          className="text-accent"
          icon={InformationCircleIcon}
          strokeWidth={2}
        />
        <Card.Header>
          <Card.Title className="text-xl font-bold">Datos Básicos</Card.Title>
        </Card.Header>
      </div>
      <Card.Content className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Nombre */}
        <TextField
          isRequired
          className="w-full"
          name="name"
          type="text"
          isInvalid={!!errors.name || undefined}
        >
          <Label>NOMBRE</Label>
          <Input
            variant="secondary"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              handleRemoveError("name");
            }}
            placeholder="Ingrese el nombre"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>

        <Select
          isRequired
          isInvalid={!!errors.level || undefined}
          aria-label="Seleccionar Disciplina"
          className="w-full"
          placeholder="Seleccionar disciplina"
          variant="secondary"
          value={level || undefined}
          onChange={(value) =>
            setLevel(value ? (value.toString() as ActivitySkillLevel) : "NA")
          }
        >
          <Label>NIVEL DE DIFICULTAD</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox items={disciplines}>
              {(discipline) => (
                <ListBox.Item
                  key={discipline.id}
                  id={discipline.id}
                  textValue={discipline.name}
                >
                  {discipline.name}
                </ListBox.Item>
              )}
            </ListBox>
          </Select.Popover>
          <FieldError children={errors.level && <> {errors.level}</>} />
        </Select>
        {/* Tipo de Actividad */}
        {parentId && setParentId && (
          <AutoCompleteActivity
            organizationId={organizationId}
            parentId={parentId}
            setParentId={setParentId}
          />
        )}

        <TextField
          isRequired
          className="w-full"
          name="maxMembers"
          type="number"
          isInvalid={!!errors.maxMembers || undefined}
        >
          <Label>Max. Participantes</Label>
          <Input
            variant="secondary"
            value={maxMembers}
            min={1}
            onChange={(e) => {
              setMaxMembers(Number(e.target.value));
              handleRemoveError("maxMembers");
            }}
            placeholder="Ingrese el máximo de estudiantes"
          />
          <FieldError
            children={errors.maxMembers && <> {errors.maxMembers}</>}
          />
        </TextField>
        <TextField
          isRequired
          className="w-full"
          name="minMembers"
          type="number"
          isInvalid={!!errors.minMembers || undefined}
        >
          <Label>Min. Participantes</Label>
          <Input
            variant="secondary"
            min={1}
            value={minMembers}
            onChange={(e) => {
              setMinMembers(Number(e.target.value));
              handleRemoveError("minMembers");
            }}
            placeholder="Ingrese el mínimo de estudiantes"
          />
          <FieldError
            children={errors.minMembers && <> {errors.minMembers}</>}
          />
        </TextField>
        <TextField
          isRequired
          className="w-full"
          name="staffRequired"
          type="number"
          isInvalid={!!errors.staffRequired || undefined}
        >
          <Label>Personal Requerido</Label>
          <Input
            variant="secondary"
            min={1}
            value={staffRequired}
            onChange={(e) => {
              setStaffRequired(Number(e.target.value));
              handleRemoveError("staffRequired");
            }}
            placeholder="Ingrese la cantidad de docentes requeridos"
          />
          <FieldError
            children={errors.staffRequired && <> {errors.staffRequired}</>}
          />
        </TextField>
      </Card.Content>
    </Card>
  );
};
