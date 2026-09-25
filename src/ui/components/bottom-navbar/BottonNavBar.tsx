"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";
import clsx from "clsx";
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
    moreItems,
    hidden,
    isMoreOpen,
    setIsMoreOpen,
    isItemActive,
    isMoreActive,
    showMoreButton,
  } = useMobileNavigation(items, urlBase);

  const pathname = usePathname();

  // Cerrar el menú "Más" si la ruta cambia
  useEffect(() => {
    setIsMoreOpen(false);
  }, [pathname, setIsMoreOpen]);

  // Divide the main items so the "More" button goes exactly in the center
  const middleIndex = Math.ceil(mainItems.length / 2);
  const leftItems = mainItems.slice(0, middleIndex);
  const rightItems = mainItems.slice(middleIndex);

  return (
    <>
      {/* Contenedor wrapper para asegurar el espacio de seguridad inferior del dispositivo y mantener la barra flotante */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 px-3 pb-3 pb-safe pointer-events-none flex justify-center">
        <motion.nav
          variants={{
            visible: { y: 0, opacity: 1 },
            hidden: { y: "150%", opacity: 0 },
          }}
          animate={hidden ? "hidden" : "visible"}
          transition={springTransition}
          className="w-full max-w-md bg-white/75 dark:bg-slate-900/75 backdrop-blur-3xl border border-white/40 dark:border-slate-700/50 shadow-2xl flex justify-between items-center px-2 py-1.5 rounded-3xl pointer-events-auto"
        >
          <div className="flex w-full justify-between items-center gap-0 relative">
            {leftItems.map((item, index) => (
              <div
                key={`left-${index}`}
                className="flex-1 flex justify-center h-full min-w-0"
              >
                <MobileNavItem
                  item={item}
                  urlBase={urlBase}
                  isActive={isItemActive(item)}
                  onClick={() => setIsMoreOpen(false)}
                />
              </div>
            ))}

            {showMoreButton && (
              <div className="flex-[0.9] md:flex-[1.2] flex justify-center relative shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsMoreOpen(!isMoreOpen)}
                  className={clsx(
                    "relative flex flex-col items-center justify-center rounded-full w-11 h-11 bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 z-10 overflow-hidden transition-shadow duration-300",
                    isMoreActive || isMoreOpen
                      ? "shadow-[0_4px_12px_rgba(14,165,233,0.4)]"
                      : "shadow-sm",
                  )}
                >
                  {/* Indicador Activo Físico que viaja al centro */}
                  {(isMoreActive || isMoreOpen) && (
                    <motion.div
                      layoutId="mobile-active-pill"
                      className="absolute inset-0 bg-linear-to-tr from-sky-600 to-sky-400"
                      initial={false}
                      transition={springTransition}
                    />
                  )}

                  <motion.div
                    className={clsx(
                      "relative z-10 transition-colors duration-300",
                      isMoreActive || isMoreOpen
                        ? "text-white"
                        : "text-slate-700 dark:text-slate-300",
                    )}
                    animate={{ rotate: isMoreOpen ? 90 : 0 }}
                    transition={springTransition}
                  >
                    <HugeiconsIcon icon={Menu01Icon} size={20} />
                  </motion.div>
                </motion.button>
              </div>
            )}

            {rightItems.map((item, index) => (
              <div
                key={`right-${index}`}
                className="flex-1 flex justify-center h-full min-w-0"
              >
                <MobileNavItem
                  item={item}
                  urlBase={urlBase}
                  isActive={isItemActive(item)}
                  onClick={() => setIsMoreOpen(false)}
                />
              </div>
            ))}
          </div>
        </motion.nav>
      </div>

      <MoreMenu
        isOpen={isMoreOpen}
        onClose={() => setIsMoreOpen(false)}
        items={moreItems}
        urlBase={urlBase}
        isItemActive={isItemActive}
      />
    </>
  );
};
