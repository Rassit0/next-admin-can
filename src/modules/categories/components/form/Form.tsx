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
  addCategory,
  editCategory,
  ICategory,
  IDisciplineOptions,
} from "@/modules/categories";

interface Props {
  category?: ICategory;
  disciplinesOptions: IDisciplineOptions[];
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormCategory = ({
  category,
  disciplinesOptions,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(category?.name || null);
  const [maxAge, setMaxAge] = useState<number | null>(category?.maxAge || null);
  const [minAge, setMinAge] = useState<number | null>(category?.minAge || null);
  const [description, setDescription] = useState(category?.description || null);
  const [disciplineId, setDisciplineId] = useState(
    category?.discipline.id || null,
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
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    if (!minAge) {
      newErrors.minAge = "Debe ingresar un año minimo";
    }
    if (!maxAge) {
      newErrors.maxAge = "Debe ingresar un año maximo";
    }
    if (minAge && maxAge && minAge > maxAge) {
      newErrors.maxAge = "El año maximo debe ser mayor al año minimo";
    }
    if (!disciplineId) {
      newErrors.disciplineId = "Debe seleccionar una disciplina";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      name: name!,
      minAge: minAge!,
      maxAge: maxAge!,
      disciplineId: disciplineId!,
      description,
    };
    if (category) {
      res = await editCategory({ id: category.id, data });
    } else {
      res = await addCategory(data);
    }
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
            value={name || ""}
            onChange={(e) => {
              setName(e.target.value || null);
              handleRemoveError("name");
            }}
            placeholder="Ingrese el nombre de la categoria"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>

        <TextField
          isRequired
          className="w-full"
          name="maxAge"
          type="text"
          isInvalid={!!errors.maxAge || undefined}
        >
          <Label>Edad Max.</Label>
          <Input
            variant="secondary"
            min={2}
            placeholder="12"
            type="number"
            value={maxAge || ""}
            onChange={(e) => {
              setMaxAge(Number(e.target.value || null));
              handleRemoveError("maxAge");
            }}
          />
          <FieldError children={errors.maxAge && <> {errors.maxAge}</>} />
        </TextField>
        <TextField
          isRequired
          className="w-full"
          name="minAge"
          type="text"
          isInvalid={!!errors.minAge || undefined}
        >
          <Label>Edad Min.</Label>
          <Input
            variant="secondary"
            min={2}
            placeholder="12"
            type="number"
            value={minAge || ""}
            onChange={(e) => {
              setMinAge(Number(e.target.value || null));
              handleRemoveError("minAge");
            }}
          />
          <FieldError children={errors.minAge && <> {errors.minAge}</>} />
        </TextField>

        <ComboBox
          variant="secondary"
          isRequired
          className="w-full"
          name="disciplineId"
          selectedKey={disciplineId}
          onSelectionChange={(key) => setDisciplineId(key?.toString() || "")}
        >
          <Label>Disciplina</Label>
          <ComboBox.InputGroup>
            <Input placeholder="Buscar disciplina..." />
            <ComboBox.Trigger />
          </ComboBox.InputGroup>
          <ComboBox.Popover>
            <ListBox>
              {disciplinesOptions.map((discipline) => (
                <ListBox.Item
                  key={discipline.id}
                  id={discipline.id}
                  textValue={discipline.name}
                >
                  {discipline.name}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </ComboBox.Popover>
          <FieldError />
        </ComboBox>
      </Form>
    </Surface>
  );
};
