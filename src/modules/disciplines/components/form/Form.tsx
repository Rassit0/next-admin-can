"use client";
import { iconMap } from "@/utils/iconMap";
import {
  Description,
  ErrorMessage,
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  Tag,
  TagGroup,
  TextField,
  toast,
  ToggleButton,
} from "@heroui/react";
import React, { useState } from "react";
import {
  addDiscipline,
  editDiscipline,
  IDiscipline,
} from "@/modules/disciplines";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  discipline?: IDiscipline;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormDiscipline = ({
  discipline,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(discipline?.name || "");
  const [icon, setIcon] = useState(discipline?.icon || "");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!icon) {
      newErrors.icon = "Debe seleccionar un icono";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    if (discipline) {
      res = await editDiscipline({ id: discipline.id, data: { name, icon } });
    } else {
      res = await addDiscipline({ data: { name, icon } });
    }
    setIsLoading?.(false);
    if (res.error) {
      toast.danger(res.message, {
        description: res.message,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      //   actionProps: {
      //     children: "Ver",
      //     className: "bg-success text-success-foreground",
      //     onPress: noop,
      //   },
      description: discipline
        ? "La disciplina se ha agregado exitosamente"
        : "La disciplina se ha agregado exitosamente",
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
            placeholder="Ingrese el nombre de la disciplina"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>
        <div className="w-full">
          {/* Contenedor de prueba con fondo para ver el ancho real */}
          <TagGroup
            selectedKeys={[icon]}
            selectionMode="single"
            onSelectionChange={(keys) => setIcon(Array.from(keys).toString())}
          >
            <Label>Seleccionar Icono</Label>
            <TagGroup.List className="flex items-center justify-center">
              {Object.keys(iconMap)
                .filter((key) => key !== "default")
                .map((key) => (
                  <Tag
                    key={key}
                    className="h-9 w-9 flex items-center justify-center"
                    id={key}
                    textValue={key}
                  >
                    <HugeiconsIcon
                      icon={iconMap[key]}
                      className="w-6 h-6" // El signo '!' obliga a Tailwind a aplicar este tamaño sobre cualquier otro
                    />
                  </Tag>
                ))}
            </TagGroup.List>
            <ErrorMessage>{errors.icon && <> {errors.icon}</>}</ErrorMessage>
          </TagGroup>
        </div>
      </Form>
    </Surface>
  );
};
