import type { Config } from "@puckeditor/core";
import { uploadNewsAsset } from "../../actions/assets";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { useState } from "react";
import { FileUploader } from "@/ui/components/file-uploader/FileUploader";
import { Spinner, Button } from "@heroui/react";
import { ImageBlock, TextImageBlock, ImageTextBlock, GalleryBlock } from "./shared-blocks";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

type NewsBlockProps = {
  Heading: { text: string; level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" };
  RichText: { text: string };
  Image: {
    assetId: string;
    alt: string;
    caption?: string;
    url?: string;
    size?:
      | "100%"
      | "90%"
      | "80%"
      | "75%"
      | "60%"
      | "50%"
      | "40%"
      | "33%"
      | "25%"
      | "20%";
    alignment?: "flex-start" | "center" | "flex-end";
    verticalAlignment?: "flex-start" | "center" | "flex-end";
    radius?: "0px" | "8px" | "16px" | "24px" | "100%";
  };
  TextImage: {
    text: string;
    assetId: string;
    layout: "50-50" | "60-40";
    alt: string;
    caption?: string;
    url?: string;
    imageSize?:
      | "100%"
      | "90%"
      | "80%"
      | "75%"
      | "60%"
      | "50%"
      | "40%"
      | "33%"
      | "25%"
      | "20%";
    imageAlignment?: "flex-start" | "center" | "flex-end";
    imageVerticalAlignment?: "flex-start" | "center" | "flex-end";
    imageRadius?: "0px" | "8px" | "16px" | "24px" | "100%";
  };
  ImageText: {
    text: string;
    assetId: string;
    layout: "50-50" | "60-40";
    alt: string;
    caption?: string;
    url?: string;
    imageSize?:
      | "100%"
      | "90%"
      | "80%"
      | "75%"
      | "60%"
      | "50%"
      | "40%"
      | "33%"
      | "25%"
      | "20%";
    imageAlignment?: "flex-start" | "center" | "flex-end";
    imageVerticalAlignment?: "flex-start" | "center" | "flex-end";
    imageRadius?: "0px" | "8px" | "16px" | "24px" | "100%";
  };
  Quote: { quote: string; author?: string };
  Gallery: {
    columns?: 1 | 2 | 3 | 4 | "1" | "2" | "3" | "4";
    images: {
      assetId: string;
      alt: string;
      caption?: string;
      url?: string;
      size?:
        | "100%"
        | "90%"
        | "80%"
        | "75%"
        | "60%"
        | "50%"
        | "40%"
        | "33%"
        | "25%"
        | "20%";
      alignment?: "flex-start" | "center" | "flex-end";
      verticalAlignment?: "flex-start" | "center" | "flex-end";
      radius?: "0px" | "8px" | "16px" | "24px" | "100%";
    }[];
  };
  Divider: {};
};

// Cache to temporarily store URLs for newly uploaded images during the session
const uploadedUrlsCache = new Map<string, string>();

const IMAGE_UPLOAD_TIMEOUT_MS = 60000;

function PuckImageUploaderField({
  value,
  onChange,
  uploadSessionId,
  addUploading,
  removeUploading,
  toast,
}: any) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setErrorMsg(null);
    addUploading();
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await uploadNewsAsset(uploadSessionId, formData);
      if (res?.error || !res?.data) {
        setErrorMsg(res?.message || "Error subiendo imagen");
        toast(res?.message || "Error subiendo imagen", { type: "error" });
        setFiles([]); // Clear to allow retry
      } else {
        uploadedUrlsCache.set(res.data.id, res.data.url);
        onChange(res.data.id);
        toast("Imagen subida correctamente", { type: "success" });
      }
    } catch (err: any) {
      setErrorMsg("Error de red o timeout");
      toast("Error de red o timeout", { type: "error" });
      setFiles([]);
    } finally {
      setIsUploading(false);
      removeUploading();
    }
  };

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    if (newFiles.length > 0 && !isUploading) {
      onChange(""); // Clear previous value to force replacement
      handleUpload(newFiles[0]);
    } else if (newFiles.length === 0 && value) {
      onChange(""); // Clear the value if the user removes the file
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-2 mb-4">
      {value ? (
        <div className="text-sm font-bold text-success">✓ Imagen adjunta</div>
      ) : null}

      {errorMsg && (
        <div className="text-sm text-danger flex flex-col gap-2 bg-danger-50 p-2 rounded-md border border-danger-200">
          <span>{errorMsg}</span>
          <Button size="sm" variant="danger-soft" onPress={() => setFiles([])}>
            Reintentar
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-warning font-semibold">
          <Spinner size="sm" color="warning" /> Subiendo... (max{" "}
          {IMAGE_UPLOAD_TIMEOUT_MS / 1000}s)
        </div>
      )}

      {!isUploading && (!value || (value && files.length === 0)) && (
        <FileUploader
          files={files}
          onFilesChange={handleFilesChange}
          maxFiles={1}
          accept="image/jpeg, image/png, image/webp, image/gif"
        />
      )}
    </div>
  );
}

// Helper for the custom file uploader field
const createAssetUploaderField = (
  uploadSessionId: string,
  addUploading: () => void,
  removeUploading: () => void,
  toast: any,
) => ({
  type: "custom" as const,
  render: ({ onChange, value }: any) => {
    return (
      <PuckImageUploaderField
        value={value}
        onChange={onChange}
        uploadSessionId={uploadSessionId}
        addUploading={addUploading}
        removeUploading={removeUploading}
        toast={toast}
      />
    );
  },
});

export const createPuckConfig = (
  uploadSessionId: string,
  addUploading: () => void,
  removeUploading: () => void,
  toast: any,
): Config<NewsBlockProps> => {
  const assetUploaderField = createAssetUploaderField(
    uploadSessionId,
    addUploading,
    removeUploading,
    toast,
  );

  return {
    root: {
      render: ({ children }) => {
        return (
          <div
            className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} font-sans antialiased text-foreground bg-transparent h-full min-h-screen`}
          >
            {children}
          </div>
        );
      },
    },
    components: {
      Heading: {
        fields: {
          text: { type: "text" },
          level: {
            type: "radio",
            options: [
              { label: "H1", value: "h1" },
              { label: "H2", value: "h2" },
              { label: "H3", value: "h3" },
              { label: "H4", value: "h4" },
              { label: "H5", value: "h5" },
              { label: "H6", value: "h6" },
            ],
          },
        },
        defaultProps: {
          text: "Texto del encabezado",
          level: "h2",
        },
        render: ({ text, level }) => {
          const Tag = level || "h2";
          
          let sizeClass = "";
          switch (Tag) {
            case "h1": sizeClass = "text-4xl sm:text-5xl"; break;
            case "h2": sizeClass = "text-3xl sm:text-4xl"; break;
            case "h3": sizeClass = "text-2xl sm:text-3xl"; break;
            case "h4": sizeClass = "text-xl sm:text-2xl"; break;
            case "h5": sizeClass = "text-lg sm:text-xl"; break;
            case "h6": sizeClass = "text-base sm:text-lg"; break;
            default: sizeClass = "text-3xl sm:text-4xl";
          }
          
          return (
            <Tag
              className={`font-heading font-700 text-oxford mb-4 mt-8 uppercase ${sizeClass}`}
            >
              {text}
            </Tag>
          );
        },
      },
      RichText: {
        fields: {
          text: {
            type: "richtext",
            options: {
              textAlign: {
                types: ["heading", "paragraph"],
              },
            },
          },
        },
        defaultProps: {
          text: "Escribe algo asombroso...",
        },
        render: ({ text }) => {
          return (
            <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-a:text-neon prose-img:rounded-2xl prose-img:border prose-img:border-border">
              {typeof text === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: text }} />
              ) : (
                text
              )}
            </div>
          );
        },
      },
      Image: {
        fields: {
          assetId: assetUploaderField,
          alt: { type: "text" },
          caption: { type: "text" },
          size: {
            type: "select",
            options: [
              { label: "100%", value: "100%" },
              { label: "90%", value: "90%" },
              { label: "80%", value: "80%" },
              { label: "75%", value: "75%" },
              { label: "60%", value: "60%" },
              { label: "50%", value: "50%" },
              { label: "40%", value: "40%" },
              { label: "33%", value: "33%" },
              { label: "25%", value: "25%" },
              { label: "20%", value: "20%" },
            ],
          },
          alignment: {
            type: "radio",
            options: [
              { label: "Izq", value: "flex-start" },
              { label: "Centro", value: "center" },
              { label: "Der", value: "flex-end" },
            ],
          },
          verticalAlignment: {
            type: "radio",
            options: [
              { label: "Arriba", value: "flex-start" },
              { label: "Medio", value: "center" },
              { label: "Abajo", value: "flex-end" },
            ],
          },
          radius: {
            type: "select",
            options: [
              { label: "16px (Mediano / Por defecto)", value: "16px" },
              { label: "0px (Cuadrado)", value: "0px" },
              { label: "8px (Pequeño)", value: "8px" },
              { label: "24px (Grande)", value: "24px" },
              { label: "Redondo", value: "100%" },
            ],
          },
        },
        defaultProps: {
          assetId: "",
          alt: "",
          url: "",
          size: "100%",
          alignment: "center",
          verticalAlignment: "center",
          radius: "16px",
        },
        render: ({ url, assetId, alt, caption, size, alignment, verticalAlignment, radius }) => {
          const displayUrl = uploadedUrlsCache.get(assetId) || url;
          return <ImageBlock url={displayUrl} alt={alt} caption={caption} size={size} alignment={alignment} verticalAlignment={verticalAlignment} radius={radius} />;
        },
      },
      TextImage: {
        fields: {
          layout: {
            type: "radio",
            options: [
              { label: "50-50", value: "50-50" },
              { label: "60-40", value: "60-40" },
            ],
          },
          text: {
            type: "richtext",
            options: {
              textAlign: {
                types: ["heading", "paragraph"],
              },
            },
          },
          assetId: assetUploaderField,
          alt: { type: "text" },
          caption: { type: "text" },
          imageSize: {
            type: "select",
            options: [
              { label: "100%", value: "100%" },
              { label: "90%", value: "90%" },
              { label: "80%", value: "80%" },
              { label: "75%", value: "75%" },
              { label: "60%", value: "60%" },
              { label: "50%", value: "50%" },
              { label: "40%", value: "40%" },
              { label: "33%", value: "33%" },
              { label: "25%", value: "25%" },
              { label: "20%", value: "20%" },
            ],
          },
          imageAlignment: {
            type: "radio",
            options: [
              { label: "Izq", value: "flex-start" },
              { label: "Centro", value: "center" },
              { label: "Der", value: "flex-end" },
            ],
          },
          imageVerticalAlignment: {
            type: "radio",
            options: [
              { label: "Arriba", value: "flex-start" },
              { label: "Medio", value: "center" },
              { label: "Abajo", value: "flex-end" },
            ],
          },
          imageRadius: {
            type: "select",
            options: [
              { label: "16px (Mediano / Por defecto)", value: "16px" },
              { label: "0px (Cuadrado)", value: "0px" },
              { label: "8px (Pequeño)", value: "8px" },
              { label: "24px (Grande)", value: "24px" },
              { label: "Redondo", value: "100%" },
            ],
          },
        },
        defaultProps: {
          layout: "50-50",
          text: "Texto aquí",
          assetId: "",
          alt: "",
          url: "",
          imageSize: "100%",
          imageAlignment: "center",
          imageVerticalAlignment: "center",
          imageRadius: "16px",
        },
        render: ({
          text,
          url,
          assetId,
          layout,
          alt,
          caption,
          imageSize,
          imageAlignment,
          imageVerticalAlignment,
          imageRadius,
        }) => {
          const displayUrl = uploadedUrlsCache.get(assetId) || url;
          return (
            <TextImageBlock
              text={text}
              url={displayUrl}
              alt={alt}
              caption={caption}
              layout={layout}
              imageSize={imageSize}
              imageAlignment={imageAlignment}
              imageVerticalAlignment={imageVerticalAlignment}
              imageRadius={imageRadius}
            />
          );
        },
      },
      ImageText: {
        fields: {
          layout: {
            type: "radio",
            options: [
              { label: "50-50", value: "50-50" },
              { label: "60-40", value: "60-40" },
            ],
          },
          assetId: assetUploaderField,
          alt: { type: "text" },
          caption: { type: "text" },
          text: {
            type: "richtext",
            options: {
              textAlign: {
                types: ["heading", "paragraph"],
              },
            },
          },
          imageSize: {
            type: "select",
            options: [
              { label: "100%", value: "100%" },
              { label: "90%", value: "90%" },
              { label: "80%", value: "80%" },
              { label: "75%", value: "75%" },
              { label: "60%", value: "60%" },
              { label: "50%", value: "50%" },
              { label: "40%", value: "40%" },
              { label: "33%", value: "33%" },
              { label: "25%", value: "25%" },
              { label: "20%", value: "20%" },
            ],
          },
          imageAlignment: {
            type: "radio",
            options: [
              { label: "Izq", value: "flex-start" },
              { label: "Centro", value: "center" },
              { label: "Der", value: "flex-end" },
            ],
          },
          imageVerticalAlignment: {
            type: "radio",
            options: [
              { label: "Arriba", value: "flex-start" },
              { label: "Medio", value: "center" },
              { label: "Abajo", value: "flex-end" },
            ],
          },
          imageRadius: {
            type: "select",
            options: [
              { label: "16px (Mediano / Por defecto)", value: "16px" },
              { label: "0px (Cuadrado)", value: "0px" },
              { label: "8px (Pequeño)", value: "8px" },
              { label: "24px (Grande)", value: "24px" },
              { label: "Redondo", value: "100%" },
            ],
          },
        },
        defaultProps: {
          layout: "50-50",
          assetId: "",
          alt: "",
          url: "",
          text: "Texto aquí",
          imageSize: "100%",
          imageAlignment: "center",
          imageVerticalAlignment: "center",
          imageRadius: "16px",
        },
        render: ({
          text,
          url,
          assetId,
          layout,
          alt,
          caption,
          imageSize,
          imageAlignment,
          imageVerticalAlignment,
          imageRadius,
        }) => {
          const displayUrl = uploadedUrlsCache.get(assetId) || url;
          return (
            <ImageTextBlock
              text={text}
              url={displayUrl}
              alt={alt}
              caption={caption}
              layout={layout}
              imageSize={imageSize}
              imageAlignment={imageAlignment}
              imageVerticalAlignment={imageVerticalAlignment}
              imageRadius={imageRadius}
            />
          );
        },
      },
      Quote: {
        fields: {
          quote: { type: "textarea" },
          author: { type: "text" },
        },
        defaultProps: {
          quote: "Esta es una cita importante",
          author: "",
        },
        render: ({ quote, author }) => {
          return (
            <blockquote
              style={{
                borderLeft: "4px solid #000",
                paddingLeft: "16px",
                margin: "16px 0",
                fontStyle: "italic",
              }}
            >
              <p>{quote}</p>
              {author && <footer>— {author}</footer>}
            </blockquote>
          );
        },
      },
      Gallery: {
        fields: {
          columns: {
            type: "select",
            options: [
              { label: "1 Columna", value: "1" },
              { label: "2 Columnas", value: "2" },
              { label: "3 Columnas", value: "3" },
              { label: "4 Columnas", value: "4" },
            ],
          },
          images: {
            type: "array",
            arrayFields: {
              assetId: assetUploaderField,
              alt: { type: "text" },
              caption: { type: "text" },
              size: {
                type: "select",
                options: [
                  { label: "100%", value: "100%" },
                  { label: "90%", value: "90%" },
                  { label: "80%", value: "80%" },
                  { label: "75%", value: "75%" },
                  { label: "60%", value: "60%" },
                  { label: "50%", value: "50%" },
                  { label: "40%", value: "40%" },
                  { label: "33%", value: "33%" },
                  { label: "25%", value: "25%" },
                  { label: "20%", value: "20%" },
                ],
              },
              alignment: {
                type: "radio",
                options: [
                  { label: "Izq", value: "flex-start" },
                  { label: "Centro", value: "center" },
                  { label: "Der", value: "flex-end" },
                ],
              },
              verticalAlignment: {
                type: "radio",
                options: [
                  { label: "Arriba", value: "flex-start" },
                  { label: "Medio", value: "center" },
                  { label: "Abajo", value: "flex-end" },
                ],
              },
              radius: {
                type: "select",
                options: [
                  { label: "16px (Mediano / Por defecto)", value: "16px" },
                  { label: "0px (Cuadrado)", value: "0px" },
                  { label: "8px (Pequeño)", value: "8px" },
                  { label: "24px (Grande)", value: "24px" },
                  { label: "Redondo", value: "100%" },
                ],
              },
            },
            defaultItemProps: {
              assetId: "",
              alt: "",
              caption: "",
              size: "100%",
              alignment: "center",
              verticalAlignment: "center",
              radius: "16px",
            },
          },
        },
        defaultProps: {
          columns: "2",
          images: [],
        },
        resolveData: ({ props }) => {
          return {
            props: {
              ...props,
              images: (props.images || []).map((img: any) => ({
                ...img,
                radius: img.radius !== undefined ? img.radius : "16px",
              })),
            },
          };
        },
        render: ({ images, columns }) => {
          const resolvedImages = (images || []).map((img) => {
            const displayUrl = uploadedUrlsCache.get(img.assetId as string) || img.url;
            return {
              ...img,
              url: displayUrl,
            };
          });

          return <GalleryBlock images={resolvedImages} columns={columns as string | number} />;
        },
      },
      Divider: {
        fields: {},
        defaultProps: {},
        render: () => <hr style={{ margin: "32px 0" }} />,
      },
    },
  };
};
