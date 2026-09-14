"use client";
import {
  Form,
  Input,
  TextField,
  Label,
  Switch,
} from "@heroui/react";
import { IBanner, PostBannerInterface } from "../../interfaces/banners.interface";
import { addBanner } from "../../actions/add";
import { editBanner } from "../../actions/edit";
import { uploadBannerImage } from "../../actions/upload";
import { useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";

interface Props {
  banner?: IBanner;
  formId: string;
  onSubmited?: (banner?: IBanner) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

export const BannerForm = ({
  banner,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [formData, setFormData] = useState<PostBannerInterface>({
    title: banner?.title || "",
    ctaText: banner?.ctaText || "",
    redirectTo: banner?.redirectTo || "",
    image16x9: banner?.image16x9 || "",
    image1x1: banner?.image1x1 || "",
    image3x4: banner?.image3x4 || "",
    category: banner?.category || "",
    isActive: banner?.isActive ?? true,
    sortOrder: banner?.sortOrder ?? 0,
  });

  const [files16x9, setFiles16x9] = useState<File[]>([]);
  const [files1x1, setFiles1x1] = useState<File[]>([]);
  const [files3x4, setFiles3x4] = useState<File[]>([]);
  
  const [isUploading16x9, setIsUploading16x9] = useState(false);
  const [isUploading1x1, setIsUploading1x1] = useState(false);
  const [isUploading3x4, setIsUploading3x4] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadImage = async (newFiles: File[], type: "16x9" | "1x1" | "3x4") => {
    if (type === "16x9") {
      setFiles16x9(newFiles);
      if (newFiles.length === 0) {
        setFormData({ ...formData, image16x9: "" });
        return;
      }
      setIsUploading16x9(true);
    } else if (type === "1x1") {
      setFiles1x1(newFiles);
      if (newFiles.length === 0) {
        setFormData({ ...formData, image1x1: "" });
        return;
      }
      setIsUploading1x1(true);
    } else {
      setFiles3x4(newFiles);
      if (newFiles.length === 0) {
        setFormData({ ...formData, image3x4: "" });
        return;
      }
      setIsUploading3x4(true);
    }

    try {
      const form = new FormData();
      form.append("file", newFiles[0]);

      const res = await uploadBannerImage(form);
      if (res.error) {
        toast.error(`Error al subir imagen ${type}`, { description: res.message });
      } else {
        if (type === "16x9") setFormData(prev => ({ ...prev, image16x9: res.data.url }));
        else if (type === "1x1") setFormData(prev => ({ ...prev, image1x1: res.data.url }));
        else if (type === "3x4") setFormData(prev => ({ ...prev, image3x4: res.data.url }));
        toast.success(`Imagen ${type} subida correctamente`);
      }
    } catch (err: unknown) {
      toast.error(`Error inesperado al subir la imagen ${type}`);
    } finally {
      if (type === "16x9") setIsUploading16x9(false);
      else if (type === "1x1") setIsUploading1x1(false);
      else if (type === "3x4") setIsUploading3x4(false);
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
    if (!formData.title) newErrors.title = "El título es obligatorio";
    if (!formData.image16x9) newErrors.image16x9 = "La imagen principal 16:9 es obligatoria";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.image16x9) toast.error(newErrors.image16x9);
      return;
    }

    setIsLoading?.(true);

    const payload = { ...formData };
    
    let res;
    if (banner) {
      res = await editBanner(banner.id, payload);
    } else {
      res = await addBanner(payload);
    }

    setIsLoading?.(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message, {
      description: banner
        ? "El banner se ha actualizado exitosamente"
        : "El banner se ha creado exitosamente",
    });

    onSubmited?.(res.data);
  };

  return (
    <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 w-full">
        <TextField isRequired variant="secondary">
          <Label>Título</Label>
          <Input
            placeholder="Ej: Promo Verano"
            value={formData.title}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onChange={(e: any) => {
              setFormData({ ...formData, title: e.target.value });
              handleRemoveError("title");
            }}
          />
          {errors.title && <span className="text-danger text-xs mt-1">{errors.title}</span>}
        </TextField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField variant="secondary">
            <Label>Texto de botón (CTA)</Label>
            <Input
              placeholder="Ej: Ver más"
              value={formData.ctaText}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => setFormData({ ...formData, ctaText: e.target.value })}
            />
          </TextField>

          <TextField variant="secondary">
            <Label>Redirección (URL o Ruta)</Label>
            <Input
              placeholder="Ej: /actualidad o https://google.com"
              value={formData.redirectTo}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => setFormData({ ...formData, redirectTo: e.target.value })}
            />
          </TextField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField variant="secondary">
            <Label>Categoría</Label>
            <Input
              placeholder="Ej: Destacado"
              value={formData.category}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
            />
          </TextField>

          <TextField variant="secondary">
            <Label>Orden (Sort Order)</Label>
            <Input
              type="number"
              placeholder="0"
              value={formData.sortOrder?.toString() || "0"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(e: any) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
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
              <span className="text-sm font-medium">Banner Activo</span>
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
            <span className="text-xs text-default-400">Obligatoria. Se usa como fallback general.</span>
            <FileUploader
              files={files16x9}
              onFilesChange={(f) => handleUploadImage(f, "16x9")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={5}
            />
            {isUploading16x9 && <span className="text-sm text-primary">Subiendo...</span>}
            {formData.image16x9 && !isUploading16x9 && (
              <div className="mt-2 text-sm text-success">
                ✅ Cargada
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Imagen Tablet (1:1)</label>
            <span className="text-xs text-default-400">Opcional. Formato cuadrado.</span>
            <FileUploader
              files={files1x1}
              onFilesChange={(f) => handleUploadImage(f, "1x1")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={5}
            />
            {isUploading1x1 && <span className="text-sm text-primary">Subiendo...</span>}
            {formData.image1x1 && !isUploading1x1 && (
              <div className="mt-2 text-sm text-success">
                ✅ Cargada
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Imagen Móvil (3:4)</label>
            <span className="text-xs text-default-400">Opcional. Formato vertical.</span>
            <FileUploader
              files={files3x4}
              onFilesChange={(f) => handleUploadImage(f, "3x4")}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={5}
            />
            {isUploading3x4 && <span className="text-sm text-primary">Subiendo...</span>}
            {formData.image3x4 && !isUploading3x4 && (
              <div className="mt-2 text-sm text-success">
                ✅ Cargada
              </div>
            )}
          </div>
        </div>

      </div>
    </Form>
  );
};
