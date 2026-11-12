import React from "react";
import {
  APP_NAME,
  APP_SYSTEM_NAME,
  APP_AUTHOR,
  APP_YEAR,
  APP_VERSION,
} from "@/config/version";

interface Props {
  className?: string;
}

export const GlobalFooter = ({ className = "" }: Props) => {
  return (
    <footer
      aria-label="Pie de página institucional"
      className={`w-full border-t border-border/50 bg-background/50 backdrop-blur-xs py-4 px-4 sm:px-6 lg:px-8 mt-auto select-none transition-colors ${className}`}
    >
      <div className="max-w-400 mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3 text-center md:text-left">
        {/* Izquierda: Sistema e institución */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
          <span className="font-semibold text-foreground/85 tracking-tight font-heading text-xs">
            {APP_NAME}
          </span>
          <span className="text-border text-xs leading-none">•</span>
          <span className="text-[11px] text-muted font-normal">
            {APP_SYSTEM_NAME}
          </span>
        </div>

        {/* Centro: Autoría y responsabilidad de mantenimiento */}
        <div className="text-[11px] text-muted">
          Desarrollado y mantenido por{" "}
          <span className="font-medium text-foreground/80">
            {APP_AUTHOR}
          </span>
        </div>

        {/* Derecha: Derechos reservados y Versión */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-[11px] text-muted">
          <span>© {APP_YEAR} · Todos los derechos reservados</span>
          <span className="text-border text-xs leading-none">•</span>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-medium bg-surface-secondary/80 border border-border/60 text-muted-foreground px-1.5 py-0.5 rounded-md">
            v{APP_VERSION}
          </span>
        </div>
      </div>
    </footer>
  );
};

