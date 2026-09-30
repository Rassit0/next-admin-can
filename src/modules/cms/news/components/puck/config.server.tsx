import type { Config } from "@puckeditor/core";
import Image from "next/image";
import { Geist, Geist_Mono, Oswald } from "next/font/google";

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
    size?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
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
    imageSize?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
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
    imageSize?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
    imageAlignment?: "flex-start" | "center" | "flex-end";
    imageRadius?: "0px" | "8px" | "16px" | "24px" | "100%";
  };
  Quote: { quote: string; author?: string };
  Gallery: {
    images: { assetId: string; alt: string; caption?: string; url?: string }[];
  };
  Divider: {};
};

export const serverConfig: Config<NewsBlockProps> = {
  root: {
    render: ({ children }) => (
      <div
        // data-theme="dark"
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} font-sans antialiased text-foreground`}
      >
        {children}
      </div>
    ),
  },
  components: {
    Heading: {
      render: ({ text, level }) => {
        const Tag = level || "h2";
        const sizeClass = Tag === "h2" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl";
        return (
          <Tag className={`font-heading font-700 text-oxford mb-4 mt-8 ${sizeClass}`}>
            {text}
          </Tag>
        );
      },
    },
    RichText: {
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
      render: ({ url, alt, caption, size, alignment, radius }) => {
        const alignClass = alignment === "flex-start" ? "items-start" : alignment === "flex-end" ? "items-end" : "items-center";
        return (
          <div className={`my-8 flex flex-col ${alignClass}`}>
            <div
              className="relative aspect-video overflow-hidden border border-border w-full"
              style={{ width: size || "100%", borderRadius: radius || "16px" }}
            >
              {url ? (
                <Image
                  src={url}
                  alt={alt || ""}
                  fill
                  sizes="(max-width: 1200px) 100vw, 80vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground text-sm uppercase tracking-wider">
                  Imagen pendiente
                </div>
              )}
            </div>
            {caption && (
              <p className="mt-2 text-center text-sm text-muted-foreground" style={{ width: size || "100%" }}>
                {caption}
              </p>
            )}
          </div>
        );
      },
    },
    TextImage: {
      render: ({ text, url, layout, alt, caption, imageSize, imageAlignment, imageRadius }) => {
        const alignClass = imageAlignment === "flex-start" ? "items-start" : imageAlignment === "flex-end" ? "items-end" : "items-center";
        return (
          <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 items-center">
            <div
              className={`prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-a:text-neon order-2 ${
                layout === "60-40"
                  ? "md:col-span-1 lg:col-span-7"
                  : "md:col-span-1 lg:col-span-6"
              } md:order-1`}
            >
              {typeof text === "string" ? (
                <div dangerouslySetInnerHTML={{ __html: text }} />
              ) : (
                text
              )}
            </div>
            <div
              className={`order-1 ${
                layout === "60-40"
                  ? "md:col-span-1 lg:col-span-5"
                  : "md:col-span-1 lg:col-span-6"
              } md:order-2 flex flex-col justify-center ${alignClass}`}
            >
              <div
                className="relative aspect-video overflow-hidden border border-border w-full"
                style={{ width: imageSize || "100%", borderRadius: imageRadius || "16px" }}
              >
                {url ? (
                  <>
                    <Image
                      src={url}
                      alt={alt || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {caption && (
                      <p className="absolute bottom-0 w-full bg-black/50 p-2 text-center text-sm text-white">
                        {caption}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground text-sm uppercase tracking-wider">
                    Imagen pendiente
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    ImageText: {
      render: ({ text, url, layout, alt, caption, imageSize, imageAlignment, imageRadius }) => {
        const alignClass = imageAlignment === "flex-start" ? "items-start" : imageAlignment === "flex-end" ? "items-end" : "items-center";
        return (
          <div className="my-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12 items-center">
            <div
              className={`order-1 ${
                layout === "60-40"
                  ? "md:col-span-1 lg:col-span-5"
                  : "md:col-span-1 lg:col-span-6"
              } flex flex-col justify-center ${alignClass}`}
            >
              <div
                className="relative aspect-video overflow-hidden border border-border w-full"
                style={{ width: imageSize || "100%", borderRadius: imageRadius || "16px" }}
              >
                {url ? (
                  <>
                    <Image
                      src={url}
                      alt={alt || ""}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    {caption && (
                      <p className="absolute bottom-0 w-full bg-black/50 p-2 text-center text-sm text-white">
                        {caption}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted/20 text-muted-foreground text-sm uppercase tracking-wider">
                    Imagen pendiente
                  </div>
                )}
              </div>
            </div>
            <div
              className={`prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-a:text-neon order-2 ${
                layout === "60-40"
                  ? "md:col-span-1 lg:col-span-7"
                  : "md:col-span-1 lg:col-span-6"
              }`}
            >
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
      render: ({ quote, author }) => {
        return (
          <blockquote className="my-8 border-l-4 border-neon pl-6 italic text-oxford">
            <p className="text-xl leading-relaxed">"{quote}"</p>
            {author && (
              <footer className="mt-2 text-sm font-600 text-muted-foreground uppercase tracking-wider">
                — {author}
              </footer>
            )}
          </blockquote>
        );
      },
    },
    Gallery: {
      render: ({ images }) => {
        if (!images || images.length === 0) return <></>;
        return (
          <div className="my-12 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {images.map((img, idx) => {
              if (!img.url) return <></>;
              return (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden rounded-2xl border border-border"
                >
                  <Image
                    src={img.url}
                    alt={img.alt || `Gallery Image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-4 opacity-0 transition-opacity hover:opacity-100">
                      <p className="text-sm text-white">{img.caption}</p>
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
      render: () => {
        return <hr className="my-12 border-border" />;
      },
    },
  },
};
