"use client";
import { Form, Input, TextField, Label, Switch } from "@heroui/react";
import {
  IHeroBanner,
  PostHeroBannerInterface,
} from "../../interfaces/hero-banner.interface";
import { addHeroBanner } from "../../actions/add";
import { editHeroBanner } from "../../actions/edit";
import { useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { InfoTooltip } from "@/ui";

interface Props {
  heroBanner?: IHeroBanner;
  formId: string;
  onSubmited?: (heroBanner?: IHeroBanner) => void;
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

export const HeroBannerForm = ({
  heroBanner,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [formData, setFormData] = useState<PostHeroBannerInterface>({
    title: heroBanner?.title || "",
    ctaText: heroBanner?.ctaText || "",
    redirectTo: heroBanner?.redirectTo || "",
    image16x9: heroBanner?.image16x9 || ("" as any),
    image1x1: heroBanner?.image1x1 || ("" as any),
    image3x4: heroBanner?.image3x4 || ("" as any),
    isActive: heroBanner?.isActive ?? true,
    sortOrder: heroBanner?.sortOrder ?? 0,
  });

  const [files16x9, setFiles16x9] = useState<File[]>([]);
  const [files1x1, setFiles1x1] = useState<File[]>([]);
  const [files3x4, setFiles3x4] = useState<File[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadImage = (
    newFiles: File[],
    type: "16x9" | "1x1" | "3x4",
  ) => {
    if (type === "16x9") {
      setFiles16x9(newFiles);
      if (newFiles.length === 0)
        setFormData({ ...formData, image16x9: "" as any });
    } else if (type === "1x1") {
      setFiles1x1(newFiles);
      if (newFiles.length === 0)
        setFormData({ ...formData, image1x1: "" as any });
    } else {
      setFiles3x4(newFiles);
      if (newFiles.length === 0)
        setFormData({ ...formData, image3x4: "" as any });
    }
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
    if (!formData.title) newErrors.title = "El tí­tulo es obligatorio";

    // Validación de imagen 16x9
    if (!heroBanner && files16x9.length === 0) {
      newErrors.image16x9 = "La imagen principal 16:9 es obligatoria";
    }
    if (heroBanner && !formData.image16x9 && files16x9.length === 0) {
      newErrors.image16x9 = "La imagen principal 16:9 es obligatoria";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.image16x9) toast.error(newErrors.image16x9);
      return;
    }

    setIsLoading?.(true);

    // Validar aspect ratio nativamente (comentado porque el backend recorta automáticamente)
    /*
    if (files16x9.length > 0) {
      const isValid = await validateImageAspectRatio(files16x9[0], 16 / 9);
      if (!isValid) {
        toast.error("La imagen Desktop debe tener un aspect ratio de 16:9.");
        setIsLoading?.(false);
        return;
      }
    }
    if (files1x1.length > 0) {
      const isValid = await validateImageAspectRatio(files1x1[0], 1 / 1);
      if (!isValid) {
        toast.error("La imagen Tablet debe tener un aspect ratio de 1:1.");
        setIsLoading?.(false);
        return;
      }
    }
    if (files3x4.length > 0) {
      const isValid = await validateImageAspectRatio(files3x4[0], 3 / 4);
      if (!isValid) {
        toast.error("La imagen Móvil debe tener un aspect ratio de 3:4.");
        setIsLoading?.(false);
        return;
      }
    }
    */

    const payload = new FormData();
    payload.append("title", formData.title);
    if (formData.ctaText) payload.append("ctaText", formData.ctaText);
    if (formData.redirectTo) payload.append("redirectTo", formData.redirectTo);
    payload.append("isActive", formData.isActive ? "true" : "false");
    payload.append("sortOrder", formData.sortOrder?.toString() || "0");

    if (files16x9.length > 0) {
      payload.append("image16x9", files16x9[0]);
    }
    if (files1x1.length > 0) {
      payload.append("image1x1", files1x1[0]);
    } else if (
      heroBanner &&
      heroBanner.image1x1 &&
      formData.image1x1 === ("" as any)
    ) {
      payload.append("removeImage1x1", "true");
    }
    if (files3x4.length > 0) {
      payload.append("image3x4", files3x4[0]);
    } else if (
      heroBanner &&
      heroBanner.image3x4 &&
      formData.image3x4 === ("" as any)
    ) {
      payload.append("removeImage3x4", "true");
    }

    let res;
    if (heroBanner) {
      res = await editHeroBanner(heroBanner.id, payload as any);
    } else {
      res = await addHeroBanner(payload as any);
    }

    setIsLoading?.(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message, {
      description: heroBanner
        ? "El Hero Banner se ha actualizado exitosamente"
        : "El Hero Banner se ha creado exitosamente",
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
          <Label>Tí­tulo</Label>
          <Input
            placeholder="Ej: Temporada 2024"
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
            <Label>Texto de botón (CTA)</Label>
            <Input
              placeholder="Ej: Ver más"
              value={formData.ctaText || ""}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setFormData({ ...formData, ctaText: e.target.value })
              }
            />
          </TextField>

          <TextField variant="secondary">
            <Label>Redirección (URL o Ruta)</Label>
            <Input
              placeholder="Ej: /actualidad o https://google.com"
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
              <span className="text-sm font-medium">Hero Banner Activo</span>
            </Switch.Content>
          </Switch>
        </div>

        <hr className="border-default-200 my-2" />

        {/* UPLOADS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Imagen Desktop (16:9) <span className="text-danger">*</span>
            </label>
            <span className="text-xs text-default-400">Obligatoria.</span>
            <FileUploader
              files={files16x9}
              onFilesChange={(f) => handleUploadImage(f, "16x9")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={5}
            />
            {formData.image16x9 && (
              <div className="mt-2 text-sm text-success">✅ Cargada</div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Imagen Tablet (1:1)</label>
            <span className="text-xs text-default-400">
              Opcional. Formato cuadrado.
            </span>
            <FileUploader
              files={files1x1}
              onFilesChange={(f) => handleUploadImage(f, "1x1")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={5}
            />
            {formData.image1x1 && (
              <div className="mt-2 text-sm text-success flex items-center justify-between">
                <span>✅ Cargada</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, image1x1: "" as any })
                  }
                  className="text-danger hover:underline cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Imagen Móvil (3:4)</label>
            <span className="text-xs text-default-400">
              Opcional. Formato vertical.
            </span>
            <FileUploader
              files={files3x4}
              onFilesChange={(f) => handleUploadImage(f, "3x4")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={5}
            />
            {formData.image3x4 && (
              <div className="mt-2 text-sm text-success flex items-center justify-between">
                <span>✅ Cargada</span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, image3x4: "" as any })
                  }
                  className="text-danger hover:underline cursor-pointer"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};
