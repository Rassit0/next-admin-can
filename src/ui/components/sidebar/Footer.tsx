"use client";

import { useCallback, useId, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { APP_NAME, APP_VERSION } from "@/config/version";

interface Props {
  isCollapsed: boolean;
}

interface TooltipCoords {
  top: number;
  left: number;
}

export const Footer = ({ isCollapsed }: Props) => {
  const tooltipId = useId();
  const [tooltipCoords, setTooltipCoords] = useState<TooltipCoords | null>(null);

  const showTooltip = useCallback(
    (target: HTMLElement) => {
      if (!isCollapsed) return;
      const rect = target.getBoundingClientRect();
      setTooltipCoords({
        top: rect.top + rect.height / 2,
        left: rect.right + 10,
      });
    },
    [isCollapsed],
  );

  const hideTooltip = useCallback(() => {
    setTooltipCoords(null);
  }, []);

  return (
    <>
      <div
        className={clsx(
          "mt-auto pt-2 pb-1 border-t border-border/60 transition-[padding] duration-300",
          isCollapsed ? "px-2 flex justify-center" : "px-3.5 flex items-center justify-between",
        )}
      >
        {isCollapsed ? (
          <span
            tabIndex={0}
            role="status"
            aria-label={`${APP_NAME} v${APP_VERSION}`}
            aria-describedby={tooltipCoords ? tooltipId : undefined}
            className="text-[10px] font-mono font-medium text-muted hover:text-foreground bg-surface-secondary/70 hover:bg-surface-secondary border border-border/50 px-1.5 py-0.5 rounded-md cursor-default transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-focus select-none"
            onBlur={hideTooltip}
            onFocus={(e) => showTooltip(e.currentTarget)}
            onMouseEnter={(e) => showTooltip(e.currentTarget)}
            onMouseLeave={hideTooltip}
          >
            v{APP_VERSION}
          </span>
        ) : (
          <>
            <span className="text-xs font-semibold text-foreground/75 tracking-tight font-heading select-none">
              {APP_NAME}
            </span>
            <span className="text-[11px] font-mono text-muted bg-surface-secondary/70 border border-border/50 px-1.5 py-0.5 rounded-md select-none">
              v{APP_VERSION}
            </span>
          </>
        )}
      </div>

      {isCollapsed &&
        tooltipCoords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="pointer-events-none fixed z-70 -translate-y-1/2 rounded-lg bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg whitespace-nowrap dark:bg-surface-secondary dark:text-foreground dark:border dark:border-border"
            id={tooltipId}
            role="tooltip"
            style={{
              top: `${tooltipCoords.top}px`,
              left: `${tooltipCoords.left}px`,
            }}
          >
            {APP_NAME} v{APP_VERSION}
          </div>,
          document.body,
        )}
    </>
  );
};
