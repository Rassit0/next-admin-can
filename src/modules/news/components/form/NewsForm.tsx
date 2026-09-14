"use client";
import {
  Form,
  Input,
  Select,
  ListBox,
  Button,
  TextField,
  Label,
  TextArea,
} from "@heroui/react";
import {
  INews,
  NewsStatus,
  PostNewsInterface,
} from "../../interfaces/news.interface";
import { addNews } from "../../actions/add";
import { editNews } from "../../actions/edit";
import { uploadNewsImage } from "../../actions/upload";
import { useState } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";

interface Props {
  news?: INews;
  formId: string;
  onSubmited?: (news?: INews) => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}

export const NewsForm = ({
  news,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [formData, setFormData] = useState<PostNewsInterface>({
    title: news?.title || "",
    excerpt: news?.excerpt || "",
    content: news?.content || "",
    category: news?.category || "",
    authorName: news?.authorName || "",
    status: news?.status || "DRAFT",
    publishedAt: news?.publishedAt
      ? new Date(news.publishedAt).toISOString().slice(0, 16)
      : "",
    imageUrl: news?.imageUrl || "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadImage = async (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setFormData({ ...formData, imageUrl: "" });
      return;
    }

    setIsUploading(true);
    try {
      const form = new FormData();
      form.append("file", newFiles[0]); // El backend espera un solo archivo llamado "file"

      const res = await uploadNewsImage(form);
      if (res.error) {
        toast.error("Error al subir imagen", { description: res.message });
      } else {
        setFormData({ ...formData, imageUrl: res.data.url });
        toast.success("Imagen subida correctamente");
      }
    } catch (err: any) {
      toast.error("Error inesperado al subir la imagen");
    } finally {
      setIsUploading(false);
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
    if (!formData.excerpt) newErrors.excerpt = "El extracto es obligatorio";
    if (!formData.content) newErrors.content = "El contenido es obligatorio";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading?.(true);

    // Preparar el payload enviando publishedAt como string iso o eliminándolo si está vacío
    const payload = { ...formData };
    if (!payload.publishedAt) {
      delete payload.publishedAt;
    } else {
      payload.publishedAt = new Date(payload.publishedAt).toISOString();
    }

    let res;
    if (news) {
      res = await editNews(news.id, news.slug, payload);
    } else {
      res = await addNews(payload);
    }

    setIsLoading?.(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message, {
      description: news
        ? "La noticia se ha actualizado exitosamente"
        : "La noticia se ha creado exitosamente",
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
          <Label>Título</Label>
          <Input
            placeholder="Ej: Nuevo Torneo Apertura"
            value={formData.title}
            onChange={(e: any) => {
              setFormData({ ...formData, title: e.target.value });
              handleRemoveError("title");
            }}
          />
          {errors.title && (
            <span className="text-danger text-xs mt-1">{errors.title}</span>
          )}
        </TextField>

        <TextField isRequired variant="secondary">
          <Label>Extracto (Resumen)</Label>
          <TextArea
            placeholder="Un breve resumen de la noticia..."
            value={formData.excerpt}
            onChange={(e: any) => {
              setFormData({ ...formData, excerpt: e.target.value });
              handleRemoveError("excerpt");
            }}
          />
          {errors.excerpt && (
            <span className="text-danger text-xs mt-1">{errors.excerpt}</span>
          )}
        </TextField>

        <TextField isRequired variant="secondary">
          <Label>Contenido</Label>
          <TextArea
            placeholder="Cuerpo principal de la noticia..."
            rows={5}
            value={formData.content}
            onChange={(e: any) => {
              setFormData({ ...formData, content: e.target.value });
              handleRemoveError("content");
            }}
          />
          {errors.content && (
            <span className="text-danger text-xs mt-1">{errors.content}</span>
          )}
        </TextField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField variant="secondary">
            <Label>Categoría</Label>
            <Input
              placeholder="Ej: Deportes"
              value={formData.category}
              onChange={(e: any) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
          </TextField>

          <TextField variant="secondary">
            <Label>Autor</Label>
            <Input
              placeholder="Nombre del redactor"
              value={formData.authorName}
              onChange={(e: any) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
            />
          </TextField>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            isRequired
            variant="secondary"
            selectedKey={formData.status!}
            onSelectionChange={(key) => {
              if (key) setFormData({ ...formData, status: key as NewsStatus });
            }}
          >
            <Label>Estado</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="DRAFT" textValue="Borrador">
                  Borrador
                </ListBox.Item>
                <ListBox.Item id="PUBLISHED" textValue="Publicado">
                  Publicado
                </ListBox.Item>
                <ListBox.Item id="ARCHIVED" textValue="Archivado">
                  Archivado
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          <TextField variant="secondary">
            <Label>Fecha de Publicación (Opcional)</Label>
            <Input
              type="datetime-local"
              value={formData.publishedAt}
              onChange={(e: any) =>
                setFormData({ ...formData, publishedAt: e.target.value })
              }
            />
          </TextField>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Portada</label>
          <FileUploader
            files={files}
            onFilesChange={handleUploadImage}
            maxFiles={1}
            accept="image/jpeg, image/png, image/webp"
            maxSizeMB={5}
          />
          {isUploading && (
            <span className="text-sm text-primary">Subiendo imagen...</span>
          )}
          {formData.imageUrl && !isUploading && (
            <div className="mt-2 text-sm text-success">
              ✓ Imagen lista. URL:{" "}
              <a
                href={formData.imageUrl}
                target="_blank"
                className="underline truncate inline-block max-w-50 align-bottom"
                rel="noreferrer"
              >
                {formData.imageUrl}
              </a>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};
