"use client";

import {
  Input,
  TextArea,
  Button,
  Switch,
  TextField,
  Label,
} from "@heroui/react";
import { useState, useRef, useEffect } from "react";
import { updateInstitutionHistorySettingsAction } from "../actions";
import { InstitutionHistorySettings } from "../services";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { toast } from "sonner";

export const InstitutionHistorySettingsForm = ({
  defaultValues,
}: {
  defaultValues: InstitutionHistorySettings;
}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [removeImage, setRemoveImage] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const checkDirty = () => {
    if (!formRef.current) return;
    const form = new FormData(formRef.current);
    const title = form.get("title") as string;
    const description = form.get("description") as string;

    const dirty =
      title !== defaultValues.title ||
      description !== defaultValues.description ||
      files.length > 0 ||
      removeImage;

    setIsDirty(dirty);
  };

  useEffect(() => {
    checkDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, removeImage, defaultValues]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = new FormData(e.currentTarget);
      if (files.length > 0) {
        form.append("image", files[0]);
      }
      form.append("removeImage", removeImage.toString());

      const res = await updateInstitutionHistorySettingsAction(form);
      if (res.error) {
        toast.error(res.message || "Error al actualizar la configuración");
      } else {
        toast.success(res.message || "Configuración actualizada correctamente");
        setFiles([]);
        setRemoveImage(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurró un error inesperado al guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      ref={formRef}
      onChange={checkDirty}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <TextField name="title" defaultValue={defaultValues.title} isRequired>
        <Label>Título</Label>
        <Input placeholder="Ej. Nuestra Historia" />
      </TextField>

      <TextField name="description" defaultValue={defaultValues.description}>
        <Label>Descripción (Texto corto)</Label>
        <TextArea placeholder="Breve introducción histórica..." />
      </TextField>

      <div className="mt-2 space-y-2">
        <label className="text-sm font-semibold">
          Imagen Principal (Opcional)
        </label>
        <p className="text-xs text-default-400">
          Sube una nueva imagen (16:9 recomendado)
        </p>

        {defaultValues.imageUrl && !removeImage && files.length === 0 && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={defaultValues.imageUrl}
              alt="Current"
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <FileUploader
          files={files}
          onFilesChange={(f: File[]) => {
            setFiles(f);
            setRemoveImage(false);
          }}
          accept="image/jpeg, image/png, image/webp"
          maxFiles={1}
          maxSizeMB={5}
        />
        {defaultValues.imageUrl && (
          <div className="flex items-center gap-3">
            <Switch isSelected={removeImage} onChange={setRemoveImage}>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <span className="text-sm font-medium">
                  Eliminar imagen actual
                </span>
              </Switch.Content>
            </Switch>
          </div>
        )}
      </div>

      {isDirty && (
        <Button
          variant="primary"
          type="submit"
          isPending={loading}
          className="mt-4 text-primary-foreground"
        >
          Guardar Configuración
        </Button>
      )}
    </form>
  );
};
