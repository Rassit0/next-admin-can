"use client";
import {
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  Switch,
  toast,
} from "@heroui/react";
import React, { useCallback, useState } from "react";
import { INewsCategory } from "../../interfaces/news-categories.interface";
import { addNewsCategory } from "../../actions/add";
import { editNewsCategory } from "../../actions/edit";
import { InfoTooltip } from "@/ui";

interface Props {
  category?: INewsCategory;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

export const NewsCategoryForm = ({
  category,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(category?.name || "");
  const [sortOrder, setSortOrder] = useState<number>(category?.sortOrder ?? 0);
  const [isActive, setIsActive] = useState<boolean>(category?.isActive ?? true);
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

    const trimmedName = name.trim();
    if (!trimmedName) {
      newErrors.name = "Debe ingresar un nombre para la categori­a";
    } else if (trimmedName.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (sortOrder < 0 || isNaN(sortOrder)) {
      newErrors.sortOrder = "El orden debe ser un niºmero mayor o igual a 0";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading?.(true);
    let res;

    const data = {
      name: trimmedName,
      sortOrder,
      isActive,
    };

    if (category) {
      res = await editNewsCategory(category.id, data);
    } else {
      res = await addNewsCategory(data);
    }

    setIsLoading?.(false);

    if (res.error) {
      let errorDescription = res.message;
      if (res.errors) {
        errorDescription = Object.entries(res.errors)
          .map(([field, messages]) => {
            const msgList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${field}: ${msgList}`;
          })
          .join("\n");
      }

      toast.danger(res.message, {
        description: res.statusCode === 409 ? res.message : undefined,
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
        {/* Slug Information - Readonly for Edit */}
        {category && (
          <TextField className="w-full" name="slug" type="text" isReadOnly>
            <Label>Slug (Generado automi¡ticamente)</Label>
            <Input
              variant="secondary"
              value={category.slug}
              placeholder="slug"
              disabled
              className="opacity-60"
            />
          </TextField>
        )}

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
              handleRemoveError("name");
            }}
            placeholder="Ingrese el nombre de la categori­a"
            disabled={isLoading}
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>

        <TextField
          isRequired
          className="w-full"
          name="sortOrder"
          type="text"
          isInvalid={!!errors.sortOrder || undefined}
        >
          <Label>
            <span className="flex items-center gap-2">
              Orden de Visualización
              <InfoTooltip text="Define el orden de aparición visual. Valores menores (ej: 0, 1) apareceri¡n primero en la lista." />
            </span>
          </Label>
          <Input
            variant="secondary"
            min={0}
            placeholder="0"
            type="number"
            value={sortOrder.toString()}
            onChange={(e) => {
              setSortOrder(parseInt(e.target.value) || 0);
              handleRemoveError("sortOrder");
            }}
            disabled={isLoading}
          />
          <FieldError children={errors.sortOrder && <> {errors.sortOrder}</>} />
        </TextField>

        <div className="w-full p-4 border rounded-lg bg-default-50 border-default-200">
          <Switch size="lg" isSelected={isActive} onChange={setIsActive}>
            <Switch.Content className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">
                  Estado de la categori­a
                </span>
                <span className="text-xs text-default-500">
                  Las categorías inactivas no se mostrari¡n en el portal web.
                </span>
              </div>
              <Switch.Control
                className={isActive ? "bg-green-500" : "bg-red-500"}
              >
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        </div>
      </Form>
    </Surface>
  );
};
