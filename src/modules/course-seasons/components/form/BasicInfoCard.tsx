import { Calendar, Card, Select, TextArea, TextField } from "@heroui/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComboBox,
  Input,
  ListBox,
  Label,
  FieldError,
  Alert,
} from "@heroui/react";
import { Dispatch, SetStateAction } from "react";
import { DateValue } from "@internationalized/date";
import { Gender, ICategoryOption, ISeasonOption } from "@/modules/course-seasons";
import { SelectCategory } from "./SelectCategory";
import { SelectSeason } from "./SelectSeason";

interface Props {
  categoriesOptions: ICategoryOption[];
  seasonsOptions: ISeasonOption[];
  categoryId: string | null;
  setCategoryId: Dispatch<SetStateAction<string | null>>;
  seasonId: string | null;
  setSeasonId: Dispatch<SetStateAction<string | null>>;
  gender: Gender | null;
  setGender: Dispatch<SetStateAction<Gender | null>>;
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  minBirthYear: number | null;
  setMinBirthYear: Dispatch<SetStateAction<number | null>>;
  maxBirthYear: number | null;
  setMaxBirthYear: Dispatch<SetStateAction<number | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
  isStructuralDisabled?: boolean;
}

export const BasicInfoCard = ({
  categoriesOptions,
  seasonsOptions,
  categoryId,
  setCategoryId,
  seasonId,
  setSeasonId,
  gender,
  setGender,
  description,
  setDescription,
  minBirthYear,
  setMinBirthYear,
  maxBirthYear,
  setMaxBirthYear,
  errors,
  handleRemoveError,
  isStructuralDisabled = false,
}: Props) => {
  return (
    <Card className="lg:p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)]  border border-l-4 border-l-accent">
      <Card.Header className="flex flex-row items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
          <HugeiconsIcon icon={Calendar04Icon} className="text-accent" />
        </div>
        <Card.Title className="font-headline font-bold text-lg">
          Información Básica
        </Card.Title>
      </Card.Header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectCategory
          label="Categoria"
          categoriesOptions={categoriesOptions}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          errors={errors}
          handleRemoveError={handleRemoveError}
          isRequired
          isDisabled={isStructuralDisabled}
        />
        <SelectSeason
          label="Temporada"
          seasonsOptions={seasonsOptions}
          seasonId={seasonId}
          setSeasonId={setSeasonId}
          errors={errors}
          handleRemoveError={handleRemoveError}
          isRequired
          isDisabled={isStructuralDisabled}
        />
        <Select
          isRequired
          isDisabled={isStructuralDisabled}
          className="w-full"
          name="gender"
          placeholder="Seleccione un genero"
          variant="secondary"
          isInvalid={!!errors.gender || undefined}
          value={gender}
          onChange={(e) => {
            setGender((e?.toString() as Gender) || null);
            handleRemoveError("gender");
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
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="FEMALE" textValue="FEMALE">
                Femenino
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="MIXED" textValue="MIXED">
                Mixto
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
          <FieldError children={errors.gender && <> {errors.gender}</>} />
        </Select>

        <div className="col-span-full">
          <Alert status="accent">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>
                Anulación de Edades de Categoría (Opcional)
              </Alert.Title>
              <Alert.Description>
                Por defecto, el sistema valida la edad de los atletas usando el
                rango de edades configurado en la Categoría y comparándolo
                contra su{" "}
                <strong>
                  edad deportiva actual (Año actual - Año de Nacimiento)
                </strong>
                . Si deseas sobrescribir ese cálculo para esta oferta en
                específico, completa los siguientes campos.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>

        <TextField
          variant="secondary"
          className="w-full"
          name="minBirthYear"
          type="number"
          isInvalid={!!errors.minBirthYear || undefined}
        >
          <Label>Año de nacimiento min. (opcional)</Label>
          <Input
            min={1900}
            placeholder="Ej: 2015"
            type="number"
            value={minBirthYear || ""}
            onChange={(e) => {
              setMinBirthYear(e.target.value ? Number(e.target.value) : null);
              handleRemoveError("minBirthYear");
            }}
          />
          <FieldError
            children={errors.minBirthYear && <> {errors.minBirthYear}</>}
          />
        </TextField>
        <TextField
          variant="secondary"
          className="w-full"
          name="maxBirthYear"
          type="number"
          isInvalid={!!errors.maxBirthYear || undefined}
        >
          <Label>Año de nacimiento max. (opcional)</Label>
          <Input
            min={1900}
            placeholder="Ej: 2016"
            type="number"
            value={maxBirthYear || ""}
            onChange={(e) => {
              setMaxBirthYear(e.target.value ? Number(e.target.value) : null);
              handleRemoveError("maxBirthYear");
            }}
          />
          <FieldError
            children={errors.maxBirthYear && <> {errors.maxBirthYear}</>}
          />
        </TextField>
        <TextField
          className="w-full col-span-full"
          name="description"
          isInvalid={!!errors.description || undefined}
        >
          <Label>Descripción</Label>
          <TextArea
            variant="secondary"
            placeholder="Ingrese la descripción de la oferta"
            rows={4}
            value={description || ""}
            onChange={(e) => {
              setDescription(e.target.value || null);
              handleRemoveError("description");
            }}
          />
          {/* <Description>Maximum 500 characters</Description> */}
          <FieldError
            children={errors.description && <> {errors.description}</>}
          />
        </TextField>
      </div>
    </Card>
  );
};
