import type { Config } from "@puckeditor/core";
import { uploadNewsAsset } from "../../actions/assets";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { useTheme } from "next-themes";

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
  Heading: { text: string; level: "h2" | "h3" };
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
    imageRadius?: "0px" | "8px" | "16px" | "24px" | "100%";
  };
  Quote: { quote: string; author?: string };
  Gallery: {
    images: { assetId: string; alt: string; caption?: string; url?: string }[];
  };
  Divider: {};
};

// Cache to temporarily store URLs for newly uploaded images during the session
const uploadedUrlsCache = new Map<string, string>();

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
      <div>
        {value ? (
          <span className="text-sm font-bold text-success block mb-2">
            Asset Attached
          </span>
        ) : null}
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            addUploading();
            try {
              const formData = new FormData();
              formData.append("file", file);
              const res = await uploadNewsAsset(uploadSessionId, formData);
              if (res.error || !res.data) {
                toast("Error subiendo imagen", { type: "error" });
              } else {
                uploadedUrlsCache.set(res.data.id, res.data.url);
                onChange(res.data.id);
                toast("Imagen subida correctamente", { type: "success" });
              }
            } catch (err) {
              toast("Error subiendo imagen", { type: "error" });
            } finally {
              removeUploading();
            }
          }}
        />
      </div>
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
        {
          const { theme } = useTheme();
          return (
            <div
              className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} font-sans antialiased text-foreground bg-background h-full min-h-screen`}
              data-theme={theme}
            >
              {children}
            </div>
          );
        }
      },
    },
    components: {
      Heading: {
        fields: {
          text: { type: "text" },
          level: {
            type: "radio",
            options: [
              { label: "H2", value: "h2" },
              { label: "H3", value: "h3" },
            ],
          },
        },
        defaultProps: {
          text: "Heading text",
          level: "h2",
        },
        render: ({ text, level }) => {
          const Tag = level || "h2";
          return (
            <Tag className="font-heading font-700 text-oxford mb-4 mt-8">
              {text}
            </Tag>
          );
        },
      },
      RichText: {
        fields: {
          text: {
            type: "richtext",
          },
        },
        defaultProps: {
          text: "Write something amazing...",
        },
        render: ({ text }) => {
          return (
            <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-a:text-neon prose-img:rounded-2xl prose-img:border prose-img:border-border">
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
          radius: {
            type: "select",
            options: [
              { label: "0px (Cuadrado)", value: "0px" },
              { label: "8px (Pequeño)", value: "8px" },
              { label: "16px (Mediano)", value: "16px" },
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
          radius: "16px",
        },
        render: ({ url, assetId, alt, caption, size, alignment, radius }) => {
          const displayUrl = uploadedUrlsCache.get(assetId) || url;
          if (!displayUrl)
            return (
              <div
                style={{
                  background: "#ccc",
                  height: "200px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Image Placeholder (Asset Attached)
              </div>
            );
          return (
            <div
              style={{
                margin: "16px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: alignment || "center",
              }}
            >
              <img
                src={displayUrl}
                alt={alt || ""}
                style={{
                  width: size || "100%",
                  maxWidth: "100%",
                  borderRadius: radius || "16px",
                }}
              />
              {caption && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "14px",
                    color: "#666",
                  }}
                >
                  {caption}
                </p>
              )}
            </div>
          );
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
          text: { type: "richtext" },
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
          imageRadius: {
            type: "select",
            options: [
              { label: "0px (Cuadrado)", value: "0px" },
              { label: "8px (Pequeño)", value: "8px" },
              { label: "16px (Mediano)", value: "16px" },
              { label: "24px (Grande)", value: "24px" },
              { label: "Redondo", value: "100%" },
            ],
          },
        },
        defaultProps: {
          layout: "50-50",
          text: "Text here",
          assetId: "",
          alt: "",
          url: "",
          imageSize: "100%",
          imageAlignment: "center",
          imageRadius: "16px",
        },
        render: ({ text, url, assetId, layout, imageSize, imageAlignment, imageRadius }) => {
          const displayUrl = uploadedUrlsCache.get(assetId) || url;
          return (
            <div
              style={{
                display: "flex",
                gap: "16px",
                margin: "16px 0",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: layout === "60-40" ? 6 : 1 }}>
                {typeof text === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: text }} />
                ) : (
                  text
                )}
              </div>
              <div
                style={{
                  flex: layout === "60-40" ? 4 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: imageAlignment || "center",
                }}
              >
                {displayUrl ? (
                  <img
                    src={displayUrl}
                    alt=""
                    style={{
                      width: imageSize || "100%",
                      maxWidth: "100%",
                      borderRadius: imageRadius || "16px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: "#ccc",
                      width: imageSize || "100%",
                      height: "100%",
                      minHeight: "150px",
                      borderRadius: imageRadius || "16px",
                    }}
                  >
                    Image
                  </div>
                )}
              </div>
            </div>
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
          text: { type: "richtext" },
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
          imageRadius: {
            type: "select",
            options: [
              { label: "0px (Cuadrado)", value: "0px" },
              { label: "8px (Pequeño)", value: "8px" },
              { label: "16px (Mediano)", value: "16px" },
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
          text: "Text here",
          imageSize: "100%",
          imageAlignment: "center",
          imageRadius: "16px",
        },
        render: ({ text, url, assetId, layout, imageSize, imageAlignment, imageRadius }) => {
          const displayUrl = uploadedUrlsCache.get(assetId) || url;
          return (
            <div
              style={{
                display: "flex",
                gap: "16px",
                margin: "16px 0",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  flex: layout === "60-40" ? 4 : 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: imageAlignment || "center",
                }}
              >
                {displayUrl ? (
                  <img
                    src={displayUrl}
                    alt=""
                    style={{
                      width: imageSize || "100%",
                      maxWidth: "100%",
                      borderRadius: imageRadius || "16px",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      background: "#ccc",
                      width: imageSize || "100%",
                      height: "100%",
                      minHeight: "150px",
                      borderRadius: imageRadius || "16px",
                    }}
                  >
                    Image
                  </div>
                )}
              </div>
              <div style={{ flex: layout === "60-40" ? 6 : 1 }}>
                {typeof text === "string" ? (
                  <div dangerouslySetInnerHTML={{ __html: text }} />
                ) : (
                  text
                )}
              </div>
            </div>
          );
        },
      },
      Quote: {
        fields: {
          quote: { type: "textarea" },
          author: { type: "text" },
        },
        defaultProps: {
          quote: "This is an important quote",
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
          images: {
            type: "array",
            arrayFields: {
              assetId: assetUploaderField,
              alt: { type: "text" },
              caption: { type: "text" },
            },
          },
        },
        defaultProps: {
          images: [],
        },
        render: ({ images }) => {
          if (!images || images.length === 0) return <div>Empty Gallery</div>;
          return (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                margin: "16px 0",
              }}
            >
              {images.map((img, i) => {
                const displayUrl =
                  uploadedUrlsCache.get(img.assetId) || img.url;
                return (
                  <div key={i}>
                    {displayUrl ? (
                      <img
                        src={displayUrl}
                        alt=""
                        style={{ maxWidth: "100%" }}
                      />
                    ) : (
                      <div style={{ background: "#ccc", height: "100px" }}>
                        Image
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
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
