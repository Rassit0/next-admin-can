"use client";
import {
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  toast,
} from "@heroui/react";
import React, { useCallback, useState } from "react";
import { addShift, editShift, IShift } from "@/modules/shifts";

interface Props {
  shift?: IShift;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormShift = ({
  shift,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(shift?.name || null);
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
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsLoading?.(true);
    let res;
    const data = {
      name: name!,
    };
    
    if (shift) {
      res = await editShift({ id: shift.id, data });
    } else {
      res = await addShift(data);
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
            placeholder="Ingrese el nombre del turno (ej. Mañana, Tarde)"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
        </TextField>
      </Form>
    </Surface>
  );
};
