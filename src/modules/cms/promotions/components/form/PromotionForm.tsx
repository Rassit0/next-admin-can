"use client";
import { Form, Input, TextField, Label, Switch } from "@heroui/react";
import {
  IPromotion,
  PostPromotionInterface,
} from "../../interfaces/promotions.interface";
import { addPromotion } from "../../actions/add";
import { editPromotion } from "../../actions/edit";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { ListBox, Select } from "@heroui/react";

interface Props {
  promotion?: IPromotion;
  formId: string;
  onSubmited?: (promotion?: IPromotion) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

export const PromotionForm = ({
  promotion,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [formData, setFormData] = useState<PostPromotionInterface>({
    title: promotion?.title || "",
    ctaText: promotion?.ctaText || "",
    redirectTo: promotion?.redirectTo || "",
    image16x9: promotion?.image16x9 || "",
    image1x1: promotion?.image1x1 || "",
    image3x4: promotion?.image3x4 || "",
    position: promotion?.position || "PROMO_1",
    isActive: promotion?.isActive ?? true,
  });

  const positions = [
    { value: "PROMO_1", label: "Promo 1" },
    { value: "PROMO_2", label: "Promo 2" },
  ];

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
      if (newFiles.length === 0) setFormData({ ...formData, image16x9: "" });
    } else if (type === "1x1") {
      setFiles1x1(newFiles);
      if (newFiles.length === 0) setFormData({ ...formData, image1x1: "" });
    } else {
      setFiles3x4(newFiles);
      if (newFiles.length === 0) setFormData({ ...formData, image3x4: "" });
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
    if (!promotion && files16x9.length === 0) {
      newErrors.image16x9 = "La imagen principal 16:9 es obligatoria";
    }
    if (promotion && !formData.image16x9 && files16x9.length === 0) {
      newErrors.image16x9 = "La imagen principal 16:9 es obligatoria";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.image16x9) toast.error(newErrors.image16x9);
      return;
    }

    setIsLoading?.(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    if (formData.ctaText) payload.append("ctaText", formData.ctaText);
    if (formData.redirectTo) payload.append("redirectTo", formData.redirectTo);
    payload.append("position", formData.position);
    payload.append("isActive", formData.isActive ? "true" : "false");

    if (files16x9.length > 0) {
      payload.append("image16x9", files16x9[0]);
    }
    if (files1x1.length > 0) {
      payload.append("image1x1", files1x1[0]);
    } else if (promotion && promotion.image1x1 && formData.image1x1 === "") {
      payload.append("removeImage1x1", "true");
    }
    if (files3x4.length > 0) {
      payload.append("image3x4", files3x4[0]);
    } else if (promotion && promotion.image3x4 && formData.image3x4 === "") {
      payload.append("removeImage3x4", "true");
    }

    let res;
    if (promotion) {
      res = await editPromotion(promotion.id, payload as any);
    } else {
      res = await addPromotion(payload as any);
    }

    setIsLoading?.(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message, {
      description: promotion
        ? "El promotion se ha actualizado exitosamente"
        : "El promotion se ha creado exitosamente",
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
            placeholder="Ej: Promo Verano"
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
              value={formData.ctaText}
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
              value={formData.redirectTo}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) =>
                setFormData({ ...formData, redirectTo: e.target.value })
              }
            />
          </TextField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            variant="secondary"
            placeholder="Seleccione una posición"
            selectedKey={formData.position}
            onSelectionChange={(key) => {
              if (key)
                setFormData({
                  ...formData,
                  position: String(key) as "PROMO_1" | "PROMO_2",
                });
            }}
          >
            <Label>Posición</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={positions}>
                {(pos) => (
                  <ListBox.Item id={pos.value} textValue={pos.label}>
                    {pos.label}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>
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
              <span className="text-sm font-medium">Promotion Activo</span>
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
            <span className="text-xs text-default-400">
              Obligatoria. Se usa como fallback general.
            </span>
            <FileUploader
              files={files16x9}
              onFilesChange={(f) => handleUploadImage(f, "16x9")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={20}
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
              maxSizeMB={20}
            />
            {formData.image1x1 && (
              <div className="mt-2 text-sm text-success flex items-center justify-between">
                <span>✅ Cargada</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image1x1: "" })}
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
              maxSizeMB={20}
            />
            {formData.image3x4 && (
              <div className="mt-2 text-sm text-success flex items-center justify-between">
                <span>✅ Cargada</span>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image3x4: "" })}
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
