import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { Monitor, Smartphone, Tablet, X } from "lucide-react";
import { NewsDetail } from "@/app/(web)/present/[slug]/news-detail";
import { PublicNewsDetail } from "@/modules/portal/news/actions/news.action";
import { ParticlesBackground } from "@/modules/portal/home/components/particles-background";
interface NewsPreviewProps {
  article: PublicNewsDetail;
  isDirty: boolean;
  onClose: () => void;
  puckConfig: any;
}

export function NewsPreview({
  article,
  isDirty,
  onClose,
  puckConfig,
}: NewsPreviewProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  const getContainerStyles = () => {
    switch (viewport) {
      case "mobile":
        return { width: "390px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", minHeight: "100%" };
      case "tablet":
        return { width: "768px", margin: "0 auto", borderLeft: "1px solid #e5e7eb", borderRight: "1px solid #e5e7eb", minHeight: "100%" };
      case "desktop":
      default:
        return { width: "100%", minHeight: "100%" };
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex flex-col bg-[var(--background-portal)] light text-foreground font-sans antialiased" data-theme="light">
      <ParticlesBackground />
      {/* Toolbar */}
      <div className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-border bg-white/80 backdrop-blur-md px-4 shadow-sm">
        <div className="flex items-center gap-4">
          <span className="font-600 uppercase tracking-wide text-oxford">
            Vista previa de la noticia
          </span>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1 z-100">
            <Button
              isIconOnly
              variant={viewport === "desktop" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setViewport("desktop")}
            >
              <Monitor size={18} />
            </Button>
            <Button
              isIconOnly
              variant={viewport === "tablet" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setViewport("tablet")}
            >
              <Tablet size={18} />
            </Button>
            <Button
              isIconOnly
              variant={viewport === "mobile" ? "primary" : "ghost"}
              size="sm"
              onPress={() => setViewport("mobile")}
            >
              <Smartphone size={18} />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isDirty ? (
            <span className="text-sm font-medium text-warning flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-warning" />
              Cambios sin guardar
            </span>
          ) : (
            <span className="text-sm font-medium text-default-500">
              Vista previa
            </span>
          )}
          <Button variant="ghost" size="sm" onPress={onClose}>
            <X size={16} className="mr-2" />
            Volver al editor
          </Button>
        </div>
      </div>

      <div className="relative z-0 flex-1 overflow-auto bg-transparent">
        <div
          style={getContainerStyles()}
          className="transition-all duration-300 shadow-sm relative light"
          data-theme="light"
        >
          {/* Use pointer-events-none on the inner content if we want to prevent interactions, but it's better to leave it interactive */}
          <div className="font-sans antialiased bg-transparent text-foreground">
            <NewsDetail article={article} puckConfig={puckConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
