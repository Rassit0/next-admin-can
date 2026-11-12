"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight, LayoutGrid, Search, X } from "lucide-react";
import { NavGroupKey, NavItem } from "@/ui/interfaces/sidebar/sidebar";
import {
  NavigationIcon,
  NavigationIconKey,
} from "@/ui/components/navigation/IconRegistry";
import { groupNavigationItems } from "@/ui/components/navigation/navigation-groups";
import { resolveNavigationHref } from "@/ui/components/navigation/navigation-url";
import {
  clampSheetDragOffset,
  classifySheetDragDirection,
  SheetGestureLock,
  shouldCloseSheetOnRelease,
} from "./sheet-gesture";

interface Props {
  id?: string;
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  urlBase?: string;
  isItemActive: (item: NavItem) => boolean;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const INITIAL_FOCUS_SELECTOR = 'a[href], button:not([disabled])';

const GROUP_ACCENT_DOT: Record<NavGroupKey | "ungrouped", string> = {
  general: "bg-sky-500",
  sports: "bg-emerald-500",
  academic: "bg-violet-500",
  finance: "bg-amber-500",
  admin: "bg-slate-400 dark:bg-slate-500",
  ungrouped: "bg-sky-500",
};

interface ActivePointerDrag {
  pointerId: number;
  startX: number;
  startY: number;
  startTime: number;
  lock: SheetGestureLock;
  startedOnHandle: boolean;
}

export const MoreMenu = ({
  id = "mobile-more-menu",
  isOpen,
  onClose,
  items,
  urlBase,
  isItemActive,
  triggerRef,
}: Props) => {
  const prefersReducedMotion = useReducedMotion();
  const titleId = useId();
  const searchId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const dragSessionRef = useRef<ActivePointerDrag | null>(null);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const resetGestureState = useCallback(() => {
    dragSessionRef.current = null;
    setIsDragging(false);
    setDragOffsetY(0);
  }, []);

  const handleItemSelect = useCallback(() => {
    resetGestureState();
    setSearchQuery("");
    onCloseRef.current();
  }, [resetGestureState]);

  const dismissMenu = useCallback(() => {
    resetGestureState();
    setSearchQuery("");
    onCloseRef.current();
    requestAnimationFrame(() => {
      triggerRef?.current?.focus();
    });
  }, [resetGestureState, triggerRef]);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frameId = requestAnimationFrame(() => {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
        INITIAL_FOCUS_SELECTOR,
      );
      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        dialogRef.current?.focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissMenu();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusables = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (
          event.shiftKey &&
          (active === first || !dialogRef.current.contains(active))
        ) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          (active === last || !dialogRef.current.contains(active))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frameId);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, dismissMenu]);

  const startPointerDrag = (
    event: React.PointerEvent<HTMLElement>,
    startedOnHandle: boolean,
  ) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    const scrollTop = scrollBodyRef.current?.scrollTop ?? 0;
    if (!startedOnHandle && scrollTop > 2) return;

    dragSessionRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startTime: performance.now(),
      lock: "pending",
      startedOnHandle,
    };

    if (startedOnHandle && event.currentTarget.setPointerCapture) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignorar si el navegador no soporta captura en ese nodo
      }
    }
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - session.startX;
    const deltaY = event.clientY - session.startY;

    if (session.lock === "pending") {
      if (
        !session.startedOnHandle &&
        (scrollBodyRef.current?.scrollTop ?? 0) > 2
      ) {
        dragSessionRef.current = null;
        return;
      }

      const direction = classifySheetDragDirection(deltaX, deltaY);
      if (direction === "pending") return;

      if (direction === "cancel") {
        dragSessionRef.current = null;
        setIsDragging(false);
        setDragOffsetY(0);
        return;
      }

      session.lock = "drag-down";
      setIsDragging(true);
    }

    if (session.lock === "drag-down") {
      setDragOffsetY(clampSheetDragOffset(deltaY));
    }
  };

  const finishPointerDrag = (event: React.PointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || session.pointerId !== event.pointerId) return;

    if (
      session.startedOnHandle &&
      event.currentTarget.hasPointerCapture?.(event.pointerId)
    ) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // Ignorar si la captura ya expiró
      }
    }

    const finalOffset =
      session.lock === "drag-down"
        ? clampSheetDragOffset(event.clientY - session.startY)
        : 0;
    const elapsedMs = performance.now() - session.startTime;

    if (
      session.lock === "drag-down" &&
      shouldCloseSheetOnRelease({ offsetY: finalOffset, elapsedMs })
    ) {
      dismissMenu();
      return;
    }

    resetGestureState();
  };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter((item) => {
        const label = (item.shortLabel ?? item.label).toLowerCase();
        const fullLabel = item.label.toLowerCase();
        return (
          label.includes(normalizedQuery) ||
          fullLabel.includes(normalizedQuery)
        );
      })
    : items;

  const highlightedItems = filteredItems.filter((item) => item.highlight);
  const groupedSections = groupNavigationItems(
    filteredItems.filter((item) => !item.highlight),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            animate={{ opacity: 1 }}
            aria-hidden="true"
            className="lg:hidden fixed inset-0 z-55 bg-black/45 dark:bg-black/70 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.05 : 0.2 }}
            onClick={dismissMenu}
          />

          <div className="lg:hidden fixed inset-x-0 bottom-0 z-60 flex justify-center md:px-4 md:pb-4 pointer-events-none">
            <motion.div
              ref={dialogRef}
              animate={{
                y: isDragging ? dragOffsetY : 0,
                opacity: 1,
              }}
              aria-labelledby={titleId}
              aria-modal="true"
              className="pointer-events-auto flex max-h-[85dvh] w-full max-w-lg md:max-w-xl flex-col overflow-hidden rounded-t-[28px] md:rounded-3xl border border-border/90 bg-background/95 shadow-2xl backdrop-blur-2xl outline-none"
              exit={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { y: "100%", opacity: 0.7 }
              }
              id={id}
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { y: "100%", opacity: 0.9 }
              }
              role="dialog"
              tabIndex={-1}
              transition={
                isDragging
                  ? { duration: 0 }
                  : prefersReducedMotion
                    ? { duration: 0.05 }
                    : { type: "spring", stiffness: 360, damping: 34 }
              }
              onPointerCancel={resetGestureState}
              onPointerMove={handlePointerMove}
              onPointerUp={finishPointerDrag}
            >
              {/* Handle superior + encabezado compacto del launcher */}
              <div
                className="shrink-0 cursor-grab active:cursor-grabbing touch-none select-none border-b border-border/70 px-4 pt-2.5 pb-3"
                onPointerDown={(e) => startPointerDrag(e, true)}
              >
                <div
                  aria-hidden="true"
                  className="mx-auto mb-2.5 h-1.5 w-12 rounded-full bg-foreground/20 dark:bg-foreground/30"
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/12 text-sky-600 dark:text-sky-400 border border-sky-500/20"
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </span>
                    <div>
                      <h2
                        className="text-sm font-bold tracking-tight text-foreground leading-none"
                        id={titleId}
                      >
                        Aplicaciones
                      </h2>
                      <p className="mt-0.5 text-[11px] font-medium text-foreground/55 leading-none">
                        {items.length}{" "}
                        {items.length === 1
                          ? "módulo disponible"
                          : "módulos disponibles"}
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label="Cerrar menú"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/80 bg-surface-secondary/85 text-foreground/75 transition-colors hover:bg-surface-secondary hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    type="button"
                    onClick={dismissMenu}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Buscador rápido tipo App Drawer */}
              <div className="shrink-0 border-b border-border/50 bg-background/60 px-3.5 sm:px-4 py-2.5">
                <div className="relative">
                  <label className="sr-only" htmlFor={searchId}>
                    Buscar aplicaciones o módulos
                  </label>
                  <Search
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/45"
                  />
                  <input
                    className="h-9 w-full rounded-xl border border-border/80 bg-surface-secondary/75 pl-9 pr-8 text-xs font-medium text-foreground placeholder:text-foreground/45 transition-colors focus:border-sky-500/60 focus:bg-surface focus:outline-none focus:ring-2 focus:ring-focus"
                    id={searchId}
                    placeholder="Buscar módulo o función..."
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button
                      aria-label="Limpiar búsqueda"
                      className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-foreground/55 hover:bg-surface-tertiary hover:text-foreground"
                      type="button"
                      onClick={() => setSearchQuery("")}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Launcher scrollable por paneles agrupados */}
              <div
                ref={scrollBodyRef}
                className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain px-3.5 sm:px-4 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] touch-pan-y space-y-3.5"
                onPointerDown={(e) => startPointerDrag(e, false)}
              >
                {highlightedItems.length > 0 && (
                  <div className="space-y-2">
                    {highlightedItems.map((item, index) => {
                      const active = isItemActive(item);
                      return (
                        <Link
                          key={item.id || `drawer-highlight-${index}`}
                          aria-current={active ? "page" : undefined}
                          className={clsx(
                            "group flex items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-150 active:scale-[0.99] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                            active
                              ? "border-indigo-500/65 bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 shadow-xs ring-1 ring-indigo-500/30"
                              : "border-indigo-300/70 dark:border-indigo-500/35 bg-linear-to-r from-indigo-500/12 via-indigo-500/6 to-surface/60 dark:from-indigo-500/18 dark:via-indigo-500/8 dark:to-surface/60 text-indigo-900 dark:text-indigo-100 hover:border-indigo-400/80",
                          )}
                          href={resolveNavigationHref(item.href, urlBase)}
                          onClick={handleItemSelect}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {item.icon && (
                              <span
                                className={clsx(
                                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors",
                                  active
                                    ? "border-indigo-400 bg-indigo-600 text-white shadow-xs"
                                    : "border-indigo-400/30 bg-indigo-500/15 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300",
                                )}
                              >
                                <NavigationIcon
                                  iconKey={item.icon as NavigationIconKey}
                                  size={20}
                                />
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold leading-tight">
                                {item.label}
                              </p>
                              <p className="mt-0.5 text-[11px] font-medium text-indigo-700/75 dark:text-indigo-300/80">
                                Acceso rápido
                              </p>
                            </div>
                          </div>

                          <ChevronRight
                            aria-hidden="true"
                            className="h-4 w-4 shrink-0 text-indigo-500/80 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}

                {groupedSections.length === 0 && highlightedItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-surface/60 px-4 py-8 text-center">
                    <Search
                      aria-hidden="true"
                      className="mb-2 h-6 w-6 text-foreground/35"
                    />
                    <p className="text-xs font-semibold text-foreground/75">
                      Sin coincidencias
                    </p>
                    <p className="mt-0.5 text-[11px] text-foreground/50">
                      No hay módulos que coincidan con «{searchQuery}».
                    </p>
                  </div>
                ) : (
                  groupedSections.map((section) => (
                    <section
                      key={section.key}
                      className="rounded-3xl border border-border/80 bg-surface/75 dark:bg-surface/65 p-3 shadow-xs space-y-2.5"
                    >
                      {section.label && (
                        <div className="flex items-center justify-between px-1">
                          <div className="flex items-center gap-2">
                            <span
                              aria-hidden="true"
                              className={clsx(
                                "h-2 w-2 rounded-full",
                                GROUP_ACCENT_DOT[section.key],
                              )}
                            />
                            <h3 className="text-[11px] font-bold uppercase tracking-wider text-foreground/75">
                              {section.label}
                            </h3>
                          </div>
                          <span className="rounded-full border border-border/70 bg-surface-secondary/90 px-2 py-0.5 text-[10px] font-semibold text-foreground/55">
                            {section.items.length}
                          </span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 min-[390px]:grid-cols-4 md:grid-cols-5 gap-2">
                        {section.items.map((item, index) => {
                          const active = isItemActive(item);
                          const displayLabel = item.shortLabel ?? item.label;

                          return (
                            <Link
                              key={
                                item.id || `${section.key}-${item.href}-${index}`
                              }
                              aria-current={active ? "page" : undefined}
                              className={clsx(
                                "group relative flex min-h-22 flex-col items-center justify-center gap-1.5 rounded-2xl border px-1.5 py-2.5 text-center transition-all duration-150 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                                active
                                  ? "border-sky-500/65 bg-sky-500/12 dark:bg-sky-500/18 shadow-xs ring-1 ring-sky-500/30"
                                  : "border-border/75 bg-surface-secondary/75 dark:bg-surface-secondary/85 hover:border-border hover:bg-surface-tertiary",
                              )}
                              href={resolveNavigationHref(item.href, urlBase)}
                              onClick={handleItemSelect}
                            >
                              <span
                                className={clsx(
                                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-150",
                                  active
                                    ? "border-sky-400/70 bg-sky-500 text-white shadow-xs"
                                    : "border-border/65 bg-background/80 dark:bg-surface-tertiary text-foreground/85 group-hover:scale-105 group-hover:text-foreground",
                                )}
                              >
                                {active && (
                                  <span
                                    aria-hidden="true"
                                    className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-sky-400 ring-2 ring-background"
                                  />
                                )}
                                {item.icon ? (
                                  <NavigationIcon
                                    iconKey={item.icon as NavigationIconKey}
                                    size={20}
                                  />
                                ) : (
                                  <span
                                    aria-hidden="true"
                                    className="text-xs font-bold"
                                  >
                                    {displayLabel.slice(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </span>

                              <span
                                className={clsx(
                                  "w-full text-[11px] leading-[1.18] line-clamp-2 wrap-break-word",
                                  active
                                    ? "font-semibold text-sky-700 dark:text-sky-300"
                                    : "font-medium text-foreground/85 group-hover:text-foreground",
                                )}
                              >
                                {displayLabel}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </section>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
