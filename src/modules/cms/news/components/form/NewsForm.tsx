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
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { getNewsCategories } from "@/modules/cms/news-categories";

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
    categoryId: news?.category?.id || "",
    authorName: news?.authorName || "",
    status: news?.status || "DRAFT",
    publishedAt: news?.publishedAt
      ? new Date(news.publishedAt).toISOString().slice(0, 16)
      : "",
    imageUrl: news?.imageUrl || "",
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    getNewsCategories().then((res) => {
      if (!res.error && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUploadImage = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length === 0) {
      setFormData({ ...formData, imageUrl: "" });
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
    if (!formData.excerpt) newErrors.excerpt = "El extracto es obligatorio";
    if (!formData.content) newErrors.content = "El contenido es obligatorio";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading?.(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("excerpt", formData.excerpt);
    payload.append("content", formData.content);
    if (formData.categoryId) payload.append("categoryId", formData.categoryId);
    if (formData.authorName) payload.append("authorName", formData.authorName);
    payload.append("status", formData.status || "DRAFT");

    if (formData.publishedAt) {
      payload.append(
        "publishedAt",
        new Date(formData.publishedAt).toISOString(),
      );
    }

    if (files.length > 0) {
      payload.append("cover", files[0]);
    } else if (news && news.imageUrl && formData.imageUrl === "") {
      payload.append("removeImageUrl", "true");
    }

    let res;
    if (news) {
      res = await editNews(news.id, news.slug, payload as any);
    } else {
      res = await addNews(payload as any);
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
          <Label>Tí­tulo</Label>
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
          <Select
            variant="secondary"
            placeholder="Seleccione una categorí­a"
            selectedKey={formData.categoryId || ""}
            onSelectionChange={(key) => {
              if (key) setFormData({ ...formData, categoryId: String(key) });
            }}
          >
            <Label>Categorí­a</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox items={categories}>
                {(cat) => (
                  <ListBox.Item id={cat.id} textValue={cat.name}>
                    {cat.name}
                  </ListBox.Item>
                )}
              </ListBox>
            </Select.Popover>
          </Select>

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
            maxSizeMB={20}
          />
          {formData.imageUrl && (
            <div className="mt-2 text-sm text-success flex items-center justify-between">
              <span>
                ✓ Imagen lista. URL:{" "}
                <a
                  href={formData.imageUrl}
                  target="_blank"
                  className="underline truncate inline-block max-w-50 align-bottom"
                  rel="noreferrer"
                >
                  {formData.imageUrl}
                </a>
              </span>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: "" })}
                className="text-danger hover:underline cursor-pointer ml-4"
              >
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};
