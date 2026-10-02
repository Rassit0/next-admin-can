"use client";
import { Form, Input, TextField, Label, Switch } from "@heroui/react";
import { ISponsor } from "../../interfaces/sponsor.interface";
import { addSponsor } from "../../actions/add";
import { editSponsor } from "../../actions/edit";
import { useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";

interface Props {
  sponsor?: ISponsor;
  formId: string;
  onSubmited?: (sponsor?: ISponsor) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

export const SponsorForm = ({
  sponsor,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [formData, setFormData] = useState({
    name: sponsor?.name || "",
    websiteUrl: sponsor?.websiteUrl || "",
    imageUrl: sponsor?.imageUrl || ("" as any),
    isActive: sponsor?.isActive ?? true,
    sortOrder: sponsor?.sortOrder ?? 0,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadImage = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length === 0) setFormData({ ...formData, imageUrl: "" as any });
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
    if (!formData.name) newErrors.name = "El nombre es obligatorio";

    if (!sponsor && files.length === 0) {
      newErrors.imageUrl = "El logo es obligatorio";
    }
    if (sponsor && !formData.imageUrl && files.length === 0) {
      newErrors.imageUrl = "El logo es obligatorio";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.imageUrl) toast.error(newErrors.imageUrl);
      return;
    }

    setIsLoading?.(true);

    const payload = new FormData();
    payload.append("name", formData.name);
    if (formData.websiteUrl) payload.append("websiteUrl", formData.websiteUrl);
    payload.append("isActive", formData.isActive ? "true" : "false");
    payload.append("sortOrder", formData.sortOrder?.toString() || "0");

    if (files.length > 0) {
      payload.append("image", files[0]);
    }

    let res;
    if (sponsor) {
      res = await editSponsor(sponsor.id, payload as any);
    } else {
      res = await addSponsor(payload as any);
    }

    setIsLoading?.(false);
    if (res.error) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
      onSubmited?.(res.data);
    }
  };

  return (
    <Form id={formId} onSubmit={handleSubmit} validationBehavior="native">
      <div className="w-full space-y-4">
        {/* Logo Upload */}
        <div className="space-y-1">
          <Label className="text-sm">
            Logo <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-muted">
            Se recomienda un fondo transparente en formato PNG o WEBP.
          </p>
          <div className="border border-default-200 border-dashed rounded-lg p-4 bg-default-100 flex flex-col items-center justify-center">
            <FileUploader
              files={files}
              onFilesChange={(newFiles) => handleUploadImage(newFiles)}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp, image/svg+xml"
              maxSizeMB={5}
            />
            {formData.imageUrl && (
              <div className="mt-2 text-sm text-success">
                ✅ Logo cargado actualmente
                <img 
                  src={formData.imageUrl} 
                  alt="Sponsor Logo" 
                  className="mt-2 w-32 h-32 object-contain"
                />
              </div>
            )}
          </div>
          {errors.imageUrl && (
            <p className="text-xs text-danger mt-1">{errors.imageUrl}</p>
          )}
        </div>

        {/* Name */}
        <TextField isRequired variant="secondary">
          <Label>Nombre del auspiciador</Label>
          <Input
            name="name"
            placeholder="Ej: Banco Nacional"
            value={formData.name}
            onChange={(e: any) => {
              setFormData({ ...formData, name: e.target.value });
              handleRemoveError("name");
            }}
          />
          {errors.name && (
            <span className="text-danger text-xs mt-1">{errors.name}</span>
          )}
        </TextField>

        {/* Website URL */}
        <TextField variant="secondary">
          <Label>Sitio web (Opcional)</Label>
          <Input
            name="websiteUrl"
            placeholder="Ej: https://banco.com"
            type="url"
            value={formData.websiteUrl}
            onChange={(e: any) => {
              setFormData({ ...formData, websiteUrl: e.target.value });
              handleRemoveError("websiteUrl");
            }}
          />
          {errors.websiteUrl && (
            <span className="text-danger text-xs mt-1">{errors.websiteUrl}</span>
          )}
        </TextField>

        {/* Sort Order */}
        <div className="grid grid-cols-2 gap-4">
          <TextField variant="secondary">
            <Label>Orden de visualización (0 es primero)</Label>
            <Input
              type="number"
              name="sortOrder"
              value={formData.sortOrder.toString()}
              onChange={(e: any) => {
                setFormData({ ...formData, sortOrder: Number(e.target.value) });
              }}
            />
          </TextField>

          {/* Active Status */}
          <div className="flex flex-col justify-center">
            <Switch
              isSelected={formData.isActive}
              onChange={(val) =>
                setFormData({ ...formData, isActive: val })
              }
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <span className="text-sm font-medium">
                  {formData.isActive ? "Activo (Visible)" : "Inactivo (Oculto)"}
                </span>
              </Switch.Content>
            </Switch>
          </div>
        </div>
      </div>
    </Form>
  );
};
