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
  ListBox,
} from "@heroui/react";
import React, { useState } from "react";
import { addSchool, editSchool, ISchool, IDisciplineOptions } from "@/modules/schools";

interface Props {
  school?: ISchool;
  disciplineId: string;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormSchool = ({
  school,
  disciplineId,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(school?.name || "");
  const [shortName, setShortName] = useState(school?.shortName || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (!disciplineId) {
      newErrors.disciplineId = "Debe ingresar una disciplina";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      name,
      shortName: shortName || undefined,
      disciplineId,
    };
    if (school) {
      res = await editSchool({ id: school.id, data });
    } else {
      res = await addSchool(data);
    }
    setIsLoading?.(false);
    if (res.error) {
      let errorDescription = res.message;

      if (res.errors) {
        // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
        errorDescription = "Error de Validación"; // Los separamos por saltos de línea para el toast
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
        <TextField
          isRequired
          className="w-full"
          name="name"
          type="text"
          isInvalid={!!errors.name || undefined}
        >
          <Label>Nombre</Label>
          <Input
            variant="secondary"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors({});
            }}
            placeholder="Ingrese el nombre del school"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>

        <TextField
          className="w-full"
          name="shortName"
          type="text"
          isInvalid={!!errors.shortName || undefined}
        >
          <Label>Nombre Abreviado (Opcional)</Label>
          <Input
            variant="secondary"
            value={shortName}
            onChange={(e) => {
              setShortName(e.target.value);
              setErrors({});
            }}
            placeholder="Ej: CAN"
          />
          <FieldError children={errors.shortName && <> {errors.shortName}</>} />
        </TextField>
      </Form>
    </Surface>
  );
};
