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
import { Maximize, Minimize, Eye } from "lucide-react";
import { NewsPreview } from "./NewsPreview";
import { PublicNewsDetail } from "@/modules/portal/news/actions/news.action";

interface Props {
  mode: "create" | "edit";
  uploadSessionId: string;
  initialData?: INews;
}

const StatusIndicator = ({ status }: { status: string }) => {
  if (status === "Guardado")
    return (
      <span className="text-success text-sm font-medium mr-2">✓ Guardado</span>
    );
  if (status === "Cambios sin guardar")
    return (
      <span className="text-warning text-sm font-medium mr-2">
        ● Cambios sin guardar
      </span>
    );
  if (status === "Guardando...")
    return (
      <span className="text-default-500 text-sm font-medium mr-2">
        ◌ Guardando...
      </span>
    );
  if (status === "Error")
    return (
      <span className="text-danger text-sm font-medium mr-2">
        ⚠ No se pudo guardar
      </span>
    );
  return null;
};

const CreateActions = ({
  isSaving,
  uploadingCount,
  handleCreate,
  handleCancel,
  contentStatus,
  isFullscreen,
  toggleFullscreen,
  openPreview,
}: any) => {
  const { appState } = usePuck();
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
      <StatusIndicator status={contentStatus} />
      <Button
        variant="ghost"
        size="sm"
        onPress={toggleFullscreen}
        className="min-w-10 px-2"
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onPress={openPreview}
        className="min-w-10 px-2"
      >
        <Eye size={18} className="sm:hidden" />
        <span className="hidden sm:inline">Vista previa</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onPress={handleCancel}
        isDisabled={isSaving}
      >
        Cancelar
      </Button>
      <Button
        variant="primary"
        size="sm"
        onPress={() => handleCreate(appState.data)}
        isDisabled={uploadingCount > 0 || isSaving}
        isPending={isSaving}
      >
        {uploadingCount > 0 ? `Subiendo...` : "Crear"}
      </Button>
    </div>
  );
};

const EditActions = ({
  isSaving,
  uploadingCount,
  handleSave,
  handleDiscard,
  contentDirty,
  contentStatus,
  isFullscreen,
  toggleFullscreen,
  openPreview,
}: any) => {
  const { appState } = usePuck();
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
      <StatusIndicator status={contentStatus} />
      <Button
        variant="ghost"
        size="sm"
        onPress={toggleFullscreen}
        className="min-w-10 px-2"
      >
        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onPress={openPreview}
        className="min-w-10 px-2"
      >
        <Eye size={18} className="sm:hidden" />
        <span className="hidden sm:inline">Vista previa</span>
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onPress={handleDiscard}
        isDisabled={!contentDirty || isSaving}
      >
        <span className="hidden sm:inline">Descartar cambios</span>
        <span className="inline sm:hidden">Descartar</span>
      </Button>
      <Button
        variant="primary"
        size="sm"
        onPress={() => handleSave(appState.data)}
        isDisabled={!contentDirty || uploadingCount > 0 || isSaving}
        isPending={isSaving}
      >
        {uploadingCount > 0 ? (
          `Subiendo...`
        ) : (
          <>
            <span className="hidden sm:inline">Guardar contenido</span>
            <span className="inline sm:hidden">Guardar</span>
          </>
        )}
      </Button>
    </div>
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

  // Metadata Dirty State
  const [metadataBaseline, setMetadataBaseline] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    categoryId: initialData?.category?.id || "",
    authorName: initialData?.authorName || "",
    status: initialData?.status || "DRAFT",
    publishedAt: initialData?.publishedAt
      ? new Date(initialData.publishedAt).toISOString().slice(0, 16)
      : "",
    coverUrl: initialData?.imageUrl || "",
  });

  const metadataDirty =
    title !== metadataBaseline.title ||
    excerpt !== metadataBaseline.excerpt ||
    categoryId !== metadataBaseline.categoryId ||
    authorName !== metadataBaseline.authorName ||
    status !== metadataBaseline.status ||
    publishedAt !== metadataBaseline.publishedAt ||
    coverFiles.length > 0 ||
    coverUrl !== metadataBaseline.coverUrl;

  // Puck Content State & Baseline
  const [contentDirty, setContentDirty] = useState(false);
  const [contentStatus, setContentStatus] = useState<
    "Guardado" | "Cambios sin guardar" | "Guardando..." | "Error"
  >(mode === "create" ? "Cambios sin guardar" : "Guardado");
  const [contentBaseline, setContentBaseline] = useState(
    initialData?.structuredContent && initialData.contentSchemaVersion === 1
      ? JSON.stringify(initialData.structuredContent)
      : JSON.stringify({ content: [], root: {} }),
  );

  const [puckData, setPuckData] = useState<any>(
    initialData?.structuredContent && initialData?.contentSchemaVersion === 1
      ? initialData.structuredContent
      : { content: [], root: {} },
  );

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handlePuckChange = (data: any) => {
    setPuckData(data); // Keep in sync for discard
    const currentStr = JSON.stringify(data);
    if (currentStr !== contentBaseline) {
      setContentDirty(true);
      if (contentStatus !== "Guardando...") {
        setContentStatus("Cambios sin guardar");
      }
    } else {
      setContentDirty(false);
      if (contentStatus !== "Guardando...") {
        setContentStatus("Guardado");
      }
    }
  };

  // Uploading and Saving states
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isSavingGeneral, setIsSavingGeneral] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [isSavingCreate, setIsSavingCreate] = useState(false);

  // Fullscreen mode
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  useEffect(() => {
    getNewsCategories().then((res) => {
      if (!res.error && res.data) {
        setCategories(res.data);
      }
    });
  }, []);

  // Suprimir logs de "unhandledRejection: [object Event]" en el dev overlay de Next.js
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

  const _buildMetadataPayload = () => {
    const payload = new FormData();
    payload.append("title", title);
    payload.append("excerpt", excerpt);
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
    return payload;
  };

  const handleCreateNews = async (data: any) => {
    if (uploadingCount > 0) {
      toast.error("Hay subidas de archivos en curso, por favor espere.");
      return;
    }
    if (!title || !excerpt) {
      toast.error("El título y extracto son obligatorios.");
      return;
    }

    setIsSavingCreate(true);
    setContentStatus("Guardando...");
    const payload = _buildMetadataPayload();
    payload.append("uploadSessionId", uploadSessionId);
    payload.append("structuredContent", JSON.stringify(data));
    payload.append("contentSchemaVersion", "1");
    payload.append("content", "Derivado por backend");

    const res = await addNews(payload);
    setIsSavingCreate(false);

    if (res.error) {
      toast.error(res.message);
      setContentStatus("Error");
      return;
    }

    toast.success("Noticia creada correctamente");
    router.push("/admin/web/news");
  };

  const handleSaveMetadata = async () => {
    if (!title || !excerpt) {
      toast.error("El título y extracto son obligatorios.");
      return;
    }
    if (!initialData) return;

    setIsSavingGeneral(true);
    const payload = _buildMetadataPayload();

    const res = await editNews(initialData.id, initialData.slug, payload);
    setIsSavingGeneral(false);

    if (res.error) {
      toast.error(res.message);
      return;
    }

    toast.success("Cambios generales guardados");
    router.push("/admin/web/news");
  };

  const handleSavePuckContent = async (data: any) => {
    if (uploadingCount > 0) {
      toast.error("Hay subidas de archivos en curso, por favor espere.");
      return;
    }
    if (!initialData) return;

    setIsSavingContent(true);
    setContentStatus("Guardando...");

    const payload = new FormData();
    payload.append("uploadSessionId", uploadSessionId);
    payload.append("structuredContent", JSON.stringify(data));
    payload.append("contentSchemaVersion", "1");

    const res = await editNews(initialData.id, initialData.slug, payload);
    setIsSavingContent(false);

    if (res.error) {
      toast.error(res.message);
      setContentStatus("Error");
      return;
    }

    toast.success("Contenido guardado correctamente");
    setContentBaseline(JSON.stringify(data));
    setContentDirty(false);
    setContentStatus("Guardado");
  };

  const handleDiscardPuckChanges = () => {
    const baselineObj = JSON.parse(contentBaseline);
    setPuckData(baselineObj);
    toast.success("Cambios descartados, se restauró el contenido guardado");
    setContentDirty(false);
    setContentStatus("Guardado");
  };

  const handleCancelCreate = async () => {
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
      {/* SECCIÓN DATOS GENERALES */}
      <div className="bg-default-soft p-6 rounded-2xl shadow-sm border border-default-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Información General</h2>
          {mode === "edit" && metadataDirty && (
            <span className="text-warning text-sm font-medium">
              ● Cambios sin guardar
            </span>
          )}
        </div>
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

          {mode === "edit" && (
            <div className="flex justify-end mt-4 border-t border-default-200 pt-4">
              <Button
                variant="primary"
                onPress={handleSaveMetadata}
                isDisabled={!metadataDirty || isSavingGeneral}
                isPending={isSavingGeneral}
              >
                Guardar cambios
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* SECCIÓN PUCK */}
      <div
        className={`bg-default-soft ${isFullscreen ? "p-0" : "pt-6"} rounded-2xl ${isFullscreen ? "shadow-none border-none" : "shadow-sm border border-default-200"}`}
      >
        {!isFullscreen && (
          <h2 className="text-xl font-bold mb-4 mx-6">
            Contenido del Artículo (Editor Puck)
          </h2>
        )}
        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-50 bg-white flex flex-col m-0 p-0 rounded-none h-dvh w-full"
              : "border border-default-200 rounded-lg overflow-auto h-200 min-h-150 relative flex flex-col mx-0 resize-y"
          }
        >
          <Puck
            config={config}
            data={puckData}
            onChange={handlePuckChange}
            onPublish={
              mode === "create" ? handleCreateNews : handleSavePuckContent
            }
            overrides={{
              headerActions: () => {
                if (mode === "create") {
                  return (
                    <CreateActions
                      isSaving={isSavingCreate}
                      uploadingCount={uploadingCount}
                      handleCreate={handleCreateNews}
                      handleCancel={handleCancelCreate}
                      contentStatus={contentStatus}
                      isFullscreen={isFullscreen}
                      toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                      openPreview={() => setIsPreviewOpen(true)}
                    />
                  );
                }
                return (
                  <EditActions
                    isSaving={isSavingContent}
                    uploadingCount={uploadingCount}
                    handleSave={handleSavePuckContent}
                    handleDiscard={handleDiscardPuckChanges}
                    contentDirty={contentDirty}
                    contentStatus={contentStatus}
                    isFullscreen={isFullscreen}
                    toggleFullscreen={() => setIsFullscreen(!isFullscreen)}
                    openPreview={() => setIsPreviewOpen(true)}
                  />
                );
              },
            }}
          />
        </div>
      </div>

      {mode === "edit" && !isFullscreen && (
        <div className="flex justify-start mt-4">
          <Button
            variant="secondary"
            onPress={() => router.push("/admin/web/news")}
          >
            Volver a noticias
          </Button>
        </div>
      )}

      {isPreviewOpen && (
        <NewsPreview
          article={{
            id: initialData?.id || "preview-id",
            slug: initialData?.slug || "preview-slug",
            title,
            excerpt,
            imageUrl: coverUrl,
            category: categories.find((c) => c.id === categoryId)?.name || "",
            categoryId,
            publishedAt: publishedAt || new Date().toISOString(),
            content: "",
            tags: [],
            authorName,
            structuredContent: puckData,
            contentSchemaVersion: 1,
          }}
          puckConfig={config}
          isDirty={metadataDirty || contentDirty}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};
