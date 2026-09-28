"use client";
import { Puck, usePuck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import "./puck-theme.css";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Input,
  Select,
  ListBox,
  TextField,
  Label,
  TextArea,
  Button,
} from "@heroui/react";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { getNewsCategories } from "@/modules/cms/news-categories";
import { INews, NewsStatus } from "../../interfaces/news.interface";
import { addNews } from "../../actions/add";
import { editNews } from "../../actions/edit";
import { cancelNewsUploadSession } from "../../actions/assets";
import { createPuckConfig } from "./config.client";

interface Props {
  mode: "create" | "edit";
  uploadSessionId: string;
  initialData?: INews;
}

const SaveButton = ({ isSaving, uploadingCount, handleSave }: any) => {
  const { appState } = usePuck();
  return (
    <Button
      className="bg-primary text-white"
      onPress={() => handleSave(appState.data)}
      isDisabled={uploadingCount > 0 || isSaving}
      isPending={isSaving}
    >
      {uploadingCount > 0
        ? `Subiendo ${uploadingCount}...`
        : isSaving
          ? "Guardando..."
          : "Guardar"}
    </Button>
  );
};

export const NewsEditorForm = ({
  mode,
  uploadSessionId,
  initialData,
}: Props) => {
  const router = useRouter();

  // General Form State
  const [title, setTitle] = useState(initialData?.title || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [categoryId, setCategoryId] = useState(initialData?.category?.id || "");
  const [authorName, setAuthorName] = useState(initialData?.authorName || "");
  const [status, setStatus] = useState<NewsStatus>(
    initialData?.status || "DRAFT",
  );
  const [publishedAt, setPublishedAt] = useState(
    initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : "",
  );

  const [coverFiles, setCoverFiles] = useState<File[]>([]);
  const [coverUrl, setCoverUrl] = useState(initialData?.imageUrl || "");

  const [categories, setCategories] = useState<any[]>([]);

  // Puck State
  const [puckData, setPuckData] = useState<any>(
    initialData?.structuredContent && initialData?.contentSchemaVersion === 1
      ? initialData.structuredContent
      : { content: [], root: {} },
  );

  // Uploading state
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getNewsCategories().then((res) => {
      if (!res.error && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  // Suprimir logs de "unhandledRejection: [object Event]" en el dev overlay de Next.js
  // Causados por el AutoFrame de Puck clonando los CSS chunks de HMR
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const handleRejection = (e: PromiseRejectionEvent) => {
      if (e.reason instanceof Event && e.reason.type === "error") {
        const target = e.reason.target as HTMLElement;
        if (target && target.tagName === "LINK") {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("unhandledrejection", handleRejection);
    return () =>
      window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  const handleUploadImage = (newFiles: File[]) => {
    setCoverFiles(newFiles);
    if (newFiles.length === 0) {
      setCoverUrl("");
    }
  };

  const handleSave = async (data: any) => {
    if (uploadingCount > 0) {
      toast.error("Hay subidas de archivos en curso, por favor espere.");
      return;
    }

    if (!title) {
      toast.error("El título es obligatorio");
      return;
    }
    if (!excerpt) {
      toast.error("El extracto es obligatorio");
      return;
    }

    setIsSaving(true);

    const payload = new FormData();
    payload.append("title", title);
    payload.append("excerpt", excerpt);
    // Note: The backend validator doesn't expect `content` in POST if structuredContent is provided,
    // but the DTO requires it, so we pass a placeholder or the backend ignores it.
    // Wait, the backend News DTO might require `content`. Let's pass a dummy or let the backend derive it.
    payload.append("content", "Derivado por backend");
    if (categoryId) payload.append("categoryId", categoryId);
    if (authorName) payload.append("authorName", authorName);
    payload.append("status", status);
    if (publishedAt) {
      payload.append("publishedAt", new Date(publishedAt).toISOString());
    }

    if (coverFiles.length > 0) {
      payload.append("cover", coverFiles[0]);
    } else if (initialData?.imageUrl && !coverUrl) {
      payload.append("removeImageUrl", "true");
    }

    payload.append("uploadSessionId", uploadSessionId);
    payload.append("structuredContent", JSON.stringify(data));
    payload.append("contentSchemaVersion", "1");

    let res;
    if (mode === "edit" && initialData) {
      res = await editNews(initialData.id, initialData.slug, payload);
    } else {
      res = await addNews(payload);
    }

    setIsSaving(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success(res.message);

    if (mode === "create") {
      router.push("/admin/web/news");
    } else {
      router.push("/admin/web/news");
    }
  };

  const handleCancel = async () => {
    await cancelNewsUploadSession(uploadSessionId);
    router.back();
  };

  const config = createPuckConfig(
    uploadSessionId,
    () => setUploadingCount((c) => c + 1),
    () => setUploadingCount((c) => c - 1),
    toast,
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-default-soft p-6 rounded-2xl shadow-sm border border-default-200">
        <h2 className="text-xl font-bold mb-4">Información General</h2>
        <div className="grid grid-cols-1 gap-6">
          <TextField isRequired variant="secondary">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </TextField>

          <TextField isRequired variant="secondary">
            <Label>Extracto (Resumen)</Label>
            <TextArea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          </TextField>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              variant="secondary"
              placeholder="Seleccione una categoría"
              value={categoryId}
              onChange={(key) => {
                if (key) setCategoryId(String(key));
              }}
            >
              <Label>Categoría</Label>
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
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
              />
            </TextField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              isRequired
              variant="secondary"
              value={status}
              onChange={(key) => {
                if (key) setStatus(key as NewsStatus);
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
                value={publishedAt}
                onChange={(e: any) => setPublishedAt(e.target.value)}
              />
            </TextField>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Portada</label>
            <FileUploader
              files={coverFiles}
              onFilesChange={handleUploadImage}
              maxFiles={1}
              accept="image/jpeg, image/png, image/webp"
              maxSizeMB={20}
            />
            {coverUrl && (
              <div className="mt-2 text-sm text-success flex items-center justify-between">
                <span>
                  ✓ Imagen actual:{" "}
                  {coverUrl.substring(coverUrl.lastIndexOf("/") + 1)}
                </span>
                <button
                  type="button"
                  onClick={() => setCoverUrl("")}
                  className="text-danger hover:underline cursor-pointer ml-4"
                >
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-default-soft pt-6 rounded-2xl shadow-sm border border-default-200">
        <h2 className="text-xl font-bold mb-4 mx-6">
          Cuerpo del Artículo (Puck Editor)
        </h2>
        <div className="border border-default-200 rounded-lg overflow-hidden h-[800px] relative flex flex-col">
          <Puck
            config={config}
            data={puckData}
            onPublish={handleSave}
            // iframe={{ enabled: false }}
            overrides={{
              headerActions: ({ children }) => (
                <>
                  <Button
                    variant="secondary"
                    onPress={handleCancel}
                    isDisabled={isSaving}
                  >
                    Cancelar
                  </Button>
                  <SaveButton
                    isSaving={isSaving}
                    uploadingCount={uploadingCount}
                    handleSave={handleSave}
                  />
                </>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
};
