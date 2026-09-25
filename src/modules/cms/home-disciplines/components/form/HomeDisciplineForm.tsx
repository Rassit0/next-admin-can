"use client";
import { Form, Input, TextField, Label, Switch } from "@heroui/react";
import {
  IHomeDiscipline,
  PostHomeDisciplineInterface,
} from "../../interfaces/home-discipline.interface";
import { addHomeDiscipline } from "../../actions/add";
import { editHomeDiscipline } from "../../actions/edit";
import { useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { InfoTooltip } from "@/ui";

interface Props {
  homeDiscipline?: IHomeDiscipline;
  formId: string;
  onSubmited?: (homeDiscipline?: IHomeDiscipline) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

const validateImageAspectRatio = (
  file: File,
  expectedRatio: number,
): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      URL.revokeObjectURL(objectUrl);
      resolve(Math.abs(ratio - expectedRatio) < 0.05);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(false);
    };
    img.src = objectUrl;
  });
};

export const HomeDisciplineForm = ({
  homeDiscipline,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [formData, setFormData] = useState<PostHomeDisciplineInterface>({
    title: homeDiscipline?.title || "",
    redirectTo: homeDiscipline?.redirectTo || "",
    image4x3: homeDiscipline?.image4x3 || ("" as any),
    isActive: homeDiscipline?.isActive ?? true,
    sortOrder: homeDiscipline?.sortOrder ?? 0,
  });

  const [files4x3, setFiles4x3] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadImage = (newFiles: File[]) => {
    setFiles4x3(newFiles);
    if (newFiles.length === 0)
      setFormData({ ...formData, image4x3: "" as any });
  };

  const handleRemoveError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if ((e.target as HTMLFormElement).id !== formId) return;

    const newErrors: Record<string, string> = {};
    if (!formData.title) newErrors.title = "El tiÂ­tulo es obligatorio";

    // Validación de imagen 4x3
    if (!homeDiscipline && files4x3.length === 0) {
      newErrors.image4x3 = "La imagen principal 4:3 es obligatoria";
    }
    if (homeDiscipline && !formData.image4x3 && files4x3.length === 0) {
      newErrors.image4x3 = "La imagen principal 4:3 es obligatoria";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.image4x3) toast.error(newErrors.image4x3);
      return;
    }

    setIsLoading?.(true);

    /* Comentado porque el backend recorta automáticamente
      if (files4x3.length > 0) {
        const isValid = await validateImageAspectRatio(files4x3[0], 4 / 3);
        if (!isValid) {
          toast.error("La imagen debe tener un aspect ratio de 4:3.");
          setIsLoading?.(false);
          return;
        }
      }
      */

    const payload = new FormData();
    payload.append("title", formData.title);
    if (formData.redirectTo) payload.append("redirectTo", formData.redirectTo);
    payload.append("isActive", formData.isActive ? "true" : "false");
    payload.append("sortOrder", formData.sortOrder?.toString() || "0");

    if (files4x3.length > 0) {
      payload.append("image4x3", files4x3[0]);
    }

    let res;
    if (homeDiscipline) {
      res = await editHomeDiscipline(homeDiscipline.id, payload as any);
    } else {
      res = await addHomeDiscipline(payload as any);
    }

    setIsLoading?.(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message, {
      description: homeDiscipline
        ? "El bloque se ha actualizado exitosamente"
        : "El bloque se ha creado exitosamente",
    });

    onSubmited?.(res.data);
  };

  return (
    <Form
      id={formId}
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col gap-4 w-full">
        <TextField isRequired variant="secondary">
          <Label>TiÂ­tulo</Label>
          <Input
            placeholder="Ej: Escuela de FiÂºtbol"
            value={formData.title}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => {
              setFormData({ ...formData, title: e.target.value });
              handleRemoveError("title");
            }}
          />
          {errors.title && (
            <span className="text-danger text-xs mt-1">{errors.title}</span>
          )}
        </TextField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField variant="secondary">
            <Label>Redirección (URL o Ruta)</Label>
            <Input
              placeholder="Ej: /equipos"
              value={formData.redirectTo || ""}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setFormData({ ...formData, redirectTo: e.target.value })
              }
            />
          </TextField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField variant="secondary">
            <Label>
              <span className="flex items-center gap-2">
                Orden (Sort Order)
                <InfoTooltip text="Define el orden de aparición visual. Valores menores (ej: 0, 1) aparecerán primero en la lista." />
              </span>
            </Label>
            <Input
              type="number"
              placeholder="0"
              value={formData.sortOrder?.toString() || "0"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setFormData({
                  ...formData,
                  sortOrder: parseInt(e.target.value) || 0,
                })
              }
            />
          </TextField>
        </div>

        <div className="flex items-center gap-3">
          <Switch
            isSelected={formData.isActive}
            onChange={(val) => setFormData({ ...formData, isActive: val })}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <span className="text-sm font-medium">Bloque Activo</span>
            </Switch.Content>
          </Switch>
        </div>

        <hr className="border-default-200 my-2" />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">
            Imagen (4:3) <span className="text-danger">*</span>
          </label>
          <span className="text-xs text-default-400">Obligatoria.</span>
          <FileUploader
            files={files4x3}
            onFilesChange={(f) => handleUploadImage(f)}
            maxFiles={1}
            accept="image/jpeg, image/png, image/webp"
            maxSizeMB={5}
          />
          {formData.image4x3 && (
            <div className="mt-2 text-sm text-success">Ã¢ÂÂ Cargada</div>
          )}
        </div>
      </div>
    </Form>
  );
};
