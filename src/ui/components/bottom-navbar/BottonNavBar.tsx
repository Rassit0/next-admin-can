"use client";

import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import clsx from "clsx";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import { useMobileNavigation } from "./hooks/useMobileNavigation";
import { MobileNavItem } from "./MobileNavItem";
import { MoreMenu } from "./MoreMenu";

interface Props {
  items: NavItem[];
  urlBase?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 380,
  damping: 28,
};

export const BottonNavBar = ({ items, urlBase }: Props) => {
  const {
    mainItems,
    drawerItems,
    hidden,
    isMoreOpen,
    setIsMoreOpen,
    isItemActive,
    isMoreActive,
    showMoreButton,
  } = useMobileNavigation(items, urlBase);

  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  // Cerrar el drawer "Más" automáticamente al cambiar de ruta
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname, setIsMoreOpen]);

  const middleIndex = Math.ceil(mainItems.length / 2);
  const leftItems = mainItems.slice(0, middleIndex);
  const rightItems = mainItems.slice(middleIndex);

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 z-50 flex w-full justify-center px-3 pb-safe pointer-events-none">
        <motion.nav
          animate={hidden && !isMoreOpen ? "hidden" : "visible"}
          aria-label="Navegación rápida móvil"
          className="pointer-events-auto flex w-full max-w-md md:max-w-lg items-center justify-between rounded-3xl border border-border/80 bg-background/85 px-2 py-1.5 shadow-2xl backdrop-blur-2xl"
          transition={
            prefersReducedMotion ? { duration: 0.05 } : springTransition
          }
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "150%", opacity: 0 },
          }}
        >
          <div className="relative flex w-full items-center justify-between gap-0.5">
            {leftItems.map((item, index) => (
              <div
                key={item.id || `left-${item.href}-${index}`}
                className="flex h-full min-w-0 flex-1 justify-center"
              >
                <MobileNavItem
                  isActive={isItemActive(item)}
                  item={item}
                  urlBase={urlBase}
                  onClick={() => setIsMoreOpen(false)}
                />
              </div>
            ))}

            {showMoreButton && (
              <div className="relative flex shrink-0 justify-center px-1">
                <motion.button
                  ref={moreButtonRef}
                  aria-controls="mobile-more-menu"
                  aria-expanded={isMoreOpen}
                  aria-label={
                    isMoreOpen
                      ? "Cerrar menú de navegación"
                      : "Abrir más opciones de navegación"
                  }
                  className={clsx(
                    "relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 flex-col items-center justify-center overflow-hidden rounded-full border border-border bg-surface-secondary/90 transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    isMoreActive || isMoreOpen
                      ? "shadow-[0_4px_14px_rgba(14,165,233,0.4)]"
                      : "shadow-sm",
                  )}
                  type="button"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.05 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                  onClick={() => setIsMoreOpen((prev) => !prev)}
                >
                  {(isMoreActive || isMoreOpen) && (
                    <motion.div
                      className="absolute inset-0 bg-linear-to-tr from-sky-600 to-sky-400"
                      initial={false}
                      layoutId="mobile-active-pill"
                      transition={
                        prefersReducedMotion
                          ? { duration: 0.05 }
                          : springTransition
                      }
                    />
                  )}

                  <motion.div
                    animate={{ rotate: isMoreOpen ? 90 : 0 }}
                    className={clsx(
                      "relative z-10 transition-colors duration-200",
                      isMoreActive || isMoreOpen
                        ? "text-white"
                        : "text-foreground/80",
                    )}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0.05 }
                        : springTransition
                    }
                  >
                    <HugeiconsIcon icon={Menu01Icon} size={20} />
                  </motion.div>
                </motion.button>
              </div>
            )}

            {rightItems.map((item, index) => (
              <div
                key={item.id || `right-${item.href}-${index}`}
                className="flex h-full min-w-0 flex-1 justify-center"
              >
                <MobileNavItem
                  isActive={isItemActive(item)}
                  item={item}
                  urlBase={urlBase}
                  onClick={() => setIsMoreOpen(false)}
                />
              </div>
            ))}
          </div>
        </motion.nav>
      </div>

      <MoreMenu
        id="mobile-more-menu"
        isItemActive={isItemActive}
        isOpen={isMoreOpen}
        items={drawerItems}
        triggerRef={moreButtonRef}
        urlBase={urlBase}
        onClose={() => setIsMoreOpen(false)}
      />
    </>
  );
};
