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
  TextArea,
} from "@heroui/react";
import React, { useCallback, useState } from "react";
import { addTeam, editTeam, ITeam } from "@/modules/teams";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";

interface Props {
  team?: ITeam;
  clubId: string;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormTeam = ({
  team,
  clubId,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(team?.name || null);
  const [shortName, setShortName] = useState(team?.shortName || null);
  const [description, setDescription] = useState(team?.description || null);
  const [files, setFiles] = useState<File[]>([]);
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

    const formData = new FormData();
    formData.append("name", name!);
    if (shortName) formData.append("shortName", shortName);
    if (description) formData.append("description", description);
    formData.append("clubId", clubId);
    if (files.length > 0) formData.append("image", files[0]);

    if (team) {
      res = await editTeam({ id: team.id, formData });
    } else {
      res = await addTeam(formData);
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
          .join("\n"); // Los separamos por saltos de lí­nea para el toast
      }

      // 2. Pasamos la descripcón formateada al componente de notificaciones
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
            placeholder="Ingrese el nombre del equipo"
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
            value={shortName || ""}
            onChange={(e) => {
              setShortName(e.target.value || null);
              handleRemoveError("shortName");
            }}
            placeholder="Ej: T1"
          />
          <FieldError children={errors.shortName && <> {errors.shortName}</>} />
        </TextField>

        <TextField
          className="w-full"
          name="description"
          type="text"
          isInvalid={!!errors.description || undefined}
          value={description || ""}
          onChange={(e) => {
            setDescription(e || null);
            handleRemoveError("description");
          }}
          variant="secondary"
        >
          <Label>Descripcón</Label>
          <TextArea placeholder="Ingrese la descripcón" />
          <FieldError
            children={errors.description && <> {errors.description}</>}
          />
        </TextField>

        <div className="flex flex-col gap-2">
          <Label>Logo del Equipo</Label>
          <FileUploader
            files={files}
            onFilesChange={setFiles}
            maxFiles={1}
            maxSizeMB={5}
            accept="image/png, image/jpeg, image/webp"
          />
          {team?.imageUrl && files.length === 0 && (
            <div className="mt-2 text-sm text-success">
              ✓ Ya existe un logo asociado
            </div>
          )}
        </div>
      </Form>
    </Surface>
  );
};
