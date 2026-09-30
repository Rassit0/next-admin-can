import React from "react";

export type ImageBlockProps = {
  url?: string;
  alt?: string;
  caption?: string;
  size?: string;
  alignment?: string;
  verticalAlignment?: string;
  radius?: string;
};

export const ImageBlock = ({ url, alt, caption, size, alignment, verticalAlignment, radius }: ImageBlockProps) => {
  return (
    <div
      style={{
        margin: "24px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: alignment || "center",
        justifyContent: verticalAlignment || "center",
      }}
    >
      {url ? (
        <img
          src={url}
          alt={alt || ""}
          style={{
            width: size || "100%",
            maxWidth: "100%",
            borderRadius: radius || "16px",
          }}
        />
      ) : (
        <div
          style={{
            background: "#ccc",
            width: size || "100%",
            height: "100%",
            minHeight: "150px",
            borderRadius: radius || "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textTransform: "uppercase",
            fontSize: "0.875rem",
          }}
        >
          Imagen pendiente
        </div>
      )}
      {caption && (
        <p className="mt-2 text-center text-sm text-muted-foreground" style={{ width: size || "100%" }}>
          {caption}
        </p>
      )}
    </div>
  );
};

export type TextImageBlockProps = {
  text: string | React.ReactNode;
  url?: string;
  alt?: string;
  caption?: string;
  layout: "50-50" | "60-40";
  imageSize?: string;
  imageAlignment?: string;
  imageVerticalAlignment?: string;
  imageRadius?: string;
};

export const TextImageBlock = ({
  text,
  url,
  layout,
  alt,
  caption,
  imageSize,
  imageAlignment,
  imageVerticalAlignment,
  imageRadius,
}: TextImageBlockProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        margin: "24px 0",
        flexWrap: "wrap",
        flexDirection: "row-reverse",
      }}
    >
      <div
        style={{
          flex: layout === "60-40" ? "4 1 300px" : "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: imageAlignment || "center",
          justifyContent: imageVerticalAlignment || "center",
        }}
      >
        {url ? (
          <img
            src={url}
            alt={alt || ""}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
              fontSize: "0.875rem",
            }}
          >
            Imagen pendiente
          </div>
        )}
      </div>
      <div
        style={{ flex: layout === "60-40" ? "6 1 300px" : "1 1 300px" }}
        className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-a:text-neon prose-img:rounded-2xl prose-img:border prose-img:border-border"
      >
        {typeof text === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export const ImageTextBlock = ({
  text,
  url,
  layout,
  alt,
  caption,
  imageSize,
  imageAlignment,
  imageVerticalAlignment,
  imageRadius,
}: TextImageBlockProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        margin: "24px 0",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          flex: layout === "60-40" ? "4 1 300px" : "1 1 300px",
          display: "flex",
          flexDirection: "column",
          alignItems: imageAlignment || "center",
          justifyContent: imageVerticalAlignment || "center",
        }}
      >
        {url ? (
          <img
            src={url}
            alt={alt || ""}
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textTransform: "uppercase",
              fontSize: "0.875rem",
            }}
          >
            Imagen pendiente
          </div>
        )}
      </div>
      <div
        style={{ flex: layout === "60-40" ? "6 1 300px" : "1 1 300px" }}
        className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-a:text-neon prose-img:rounded-2xl prose-img:border prose-img:border-border"
      >
        {typeof text === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: text }} />
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export type GalleryImageProps = {
  url?: string;
  alt?: string;
  caption?: string;
  size?: string;
  alignment?: string;
  verticalAlignment?: string;
  radius?: string;
};

export type GalleryBlockProps = {
  images: GalleryImageProps[];
  columns: string | number;
};

export const GalleryBlock = ({ images, columns }: GalleryBlockProps) => {
  if (!images || images.length === 0) return <div>Galería vacía</div>;

  const colCount = Number(columns) || 2;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${colCount}, 1fr)`,
        gap: "16px",
        margin: "16px 0",
      }}
    >
      {images.map((img, i) => {
        return (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: img.alignment || "center",
              justifyContent: img.verticalAlignment || "center",
            }}
          >
            {img.url ? (
              <img
                src={img.url}
                alt={img.alt || ""}
                style={{
                  width: img.size || "100%",
                  maxWidth: "100%",
                  borderRadius: img.radius || "16px",
                }}
              />
            ) : (
              <div
                style={{
                  background: "#ccc",
                  height: "150px",
                  width: img.size || "100%",
                  borderRadius: img.radius || "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Imagen
              </div>
            )}
            {img.caption && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  color: "#666",
                  marginTop: "8px",
                }}
              >
                {img.caption}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};
