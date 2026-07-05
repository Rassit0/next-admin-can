"use client";
import { iconMap } from "@/utils/iconMap";
import {
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  toast,
  ComboBox,
  Select,
  ListBox,
} from "@heroui/react";
import React, { useCallback, useState } from "react";
import {
  addTeamSeason,
  editTeamSeason,
  Gender,
  ICategoryOption,
  ISeasonOption,
  ITeamSeason,
  SelectCategory,
  SelectSeason,
} from "@/modules/team-seasons";

interface Props {
  teamId: string;
  teamSeason?: ITeamSeason;
  categoriesOptions: ICategoryOption[];
  seasonsOptions: ISeasonOption[];
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormTeamSeason = ({
  teamId,
  teamSeason,
  categoriesOptions,
  seasonsOptions,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [categoryId, setCategoryId] = useState(teamSeason?.category.id || null);
  const [seasonId, setSeasonId] = useState(teamSeason?.season.id || null);
  const [maxMembers, setMaxMembers] = useState<number | null>(null);
  const [minMembers, setMinMembers] = useState<number | null>(null);
  const [gender, setGender] = useState<Gender | null>(
    teamSeason?.gender || null,
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleRemoveError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!categoryId) {
      newErrors.categoryId = "Debe seleccionar una categoria";
    }
    if (!seasonId) {
      newErrors.seasonId = "Debe seleccionar una temporada";
    }
    if (!maxMembers) {
      newErrors.maxMembers = "Debe ingresar el maximo de integrantes";
    }
    if (!minMembers) {
      newErrors.minMembers = "Debe ingresar el minimo de integrantes";
    }
    if (minMembers && maxMembers && minMembers > maxMembers) {
      newErrors.minMembers =
        "El minimo de integrantes no puede ser mayor al maximo";
    }
    if (!gender) {
      newErrors.gender = "Debe seleccionar un genero";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      teamId: teamId,
      categoryId: categoryId!,
      seasonId: seasonId!,
      maxMembers: maxMembers!,
      minMembers: minMembers!,
      gender: gender!,
    };
    if (teamSeason) {
      // res = await editTeamSeason({ id: teamSeason.id, data });
    } else {
      // res = await addTeamSeason(data);
    }
    return;
    setIsLoading?.(false);
    if (res.error) {
      let errorDescription = res.message;

      if (res.errors) {
        // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
        errorDescription = Object.entries(res.errors)
          .map(([field, messages]) => {
            const msgList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${field}: ${msgList}`;
          })
          .join("\n"); // Los separamos por saltos de línea para el toast
      }

      // 2. Pasamos la descripción formateada al componente de notificaciones
      toast.danger(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: res.message,
    });
    onSubmited?.();
  };

  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <SelectCategory
          label="Categoria"
          categoriesOptions={categoriesOptions}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          errors={errors}
          handleRemoveError={handleRemoveError}
          isRequired
        />
        <SelectSeason
          label="Temporada"
          seasonsOptions={seasonsOptions}
          seasonId={seasonId}
          setSeasonId={setSeasonId}
          errors={errors}
          handleRemoveError={handleRemoveError}
          isRequired
        />

        <Select
          isRequired
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

        <div>
          <TextField
            isRequired
            className="w-full"
            name="maxYear"
            type="text"
            isInvalid={!!errors.maxYear || undefined}
          >
            <Label>Max. Integrantes</Label>
            <Input
              variant="secondary"
              min={2}
              placeholder="12"
              type="number"
              value={maxMembers || ""}
              onChange={(e) => {
                setMaxMembers(Number(e.target.value));
                handleRemoveError("maxMembers");
              }}
            />
            <FieldError
              children={errors.maxMembers && <> {errors.maxMembers}</>}
            />
          </TextField>
          <TextField
            isRequired
            className="w-full"
            name="minMembers"
            type="text"
            isInvalid={!!errors.minMembers || undefined}
          >
            <Label>Min. Integrantes</Label>
            <Input
              variant="secondary"
              min={2}
              placeholder="12"
              type="number"
              value={minMembers || ""}
              onChange={(e) => {
                setMinMembers(Number(e.target.value));
                handleRemoveError("minMembers");
              }}
            />
            <FieldError
              children={errors.minMembers && <> {errors.minMembers}</>}
            />
          </TextField>
        </div>
      </Form>
    </Surface>
  );
};
