import type { Config } from "@puckeditor/core";
import Image from "next/image";
import { ImageBlock, TextImageBlock, ImageTextBlock, GalleryBlock } from "./shared-blocks";
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
  Heading: { text: string; level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" };
  RichText: { text: string };
  Image: { 
    assetId: string; 
    alt: string; 
    caption?: string; 
    url?: string;
    size?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
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
    imageSize?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
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
    imageSize?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
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
      size?: "100%" | "90%" | "80%" | "75%" | "60%" | "50%" | "40%" | "33%" | "25%" | "20%";
      alignment?: "flex-start" | "center" | "flex-end";
      verticalAlignment?: "flex-start" | "center" | "flex-end";
      radius?: "0px" | "8px" | "16px" | "24px" | "100%";
    }[];
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
          <Tag className={`font-heading font-700 text-oxford mb-4 mt-8 uppercase ${sizeClass}`}>
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
      render: (props) => <ImageBlock {...props} />,
    },
    TextImage: {
      render: (props) => <TextImageBlock {...props} />,
    },
    ImageText: {
      render: (props) => <ImageTextBlock {...props} />,
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
      render: ({ images, columns }) => {
        return <GalleryBlock images={images} columns={columns || 2} />;
      },
    },
    Divider: {
      render: () => {
        return <hr className="my-12 border-border" />;
      },
    },
  },
};
