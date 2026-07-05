"use client";
import {
  Notification01Icon,
  Search01Icon,
  SidebarLeftIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { ThemeButton } from "./ThemeButton";
import React, { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Button } from "@heroui/react";

interface HeaderProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
}
export const Header = ({ title, actions }: HeaderProps) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const direction = latest - previous;

    // 1. Prioridad: Si estamos en el tope (hasta 70px), siempre visible.
    // Esto es el "cerrojo": no dejamos que nada más pase si estamos arriba.
    if (latest <= 70) {
      setHidden(false);
      return;
    }

    // 2. Si bajamos (dirección positiva), ocultar.
    if (direction > 0) {
      setHidden(true);
    }
    // 3. Si subimos (dirección negativa), NO hacemos nada.
    // Al no haber un 'setHidden(false)' aquí, el header se mantiene oculto
    // hasta que vuelvas a tocar el tope y se ejecute el punto 1.
  });
  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 z-40 w-full flex justify-between items-center px-1 md:px-4 lg:px-8 md:pl-2 py-0 md:py-2 lg:py-4 backdrop-blur-xl"
    >
      {/* <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md">
          <HugeiconsIcon
            icon={Search01Icon}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm text-foreground focus:ring-2 focus:ring-sky-500 transition-all"
            placeholder="Buscar..."
            type="text"
          />
        </div>
      </div> */}
      <div className="flex items-center gap-4">
        <Button className="md:hidden" isIconOnly variant="ghost">
          <HugeiconsIcon icon={SidebarLeftIcon} />
        </Button>
        <span className="hidden md:block text-3xl font-semibold text-on-surface font-headline leading-tight">
          {title || "Buen día, Mauricio"}
        </span>
        <span className="text-sm text-muted"></span>
      </div>
      <div className="flex items-center gap-2 md:gap-6">
        <div>{actions}</div>
        <div className="flex items-center gap-1 md:gap-2">
          <button className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full p-2 relative">
            <HugeiconsIcon icon={Notification01Icon} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
          <ThemeButton />
        </div>
        <div className="h-8 w-px bg-outline-variant/30 hidden md:block"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-on-surface font-headline leading-tight">
              Admin CAN
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
              Superusuario
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border-2 border-primary-container/20">
            <img
              alt="Avatar de Usuario Administrativo"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEp9jnhMRX_Y2u47NpUQL2Rc9po8bXJeofB7yPxD0naG1SCZiTxEu5Le8Ksk0-W0XIWcGM4HM4XHcIqjv3BOglIgoi-hyAdTpQ9yl1T0MXlmQIaJq0weKGtVGZwyL3RdtLz8YwC3w3O4k0gTq7Bu8XfcGWbFXhfUSOy3S6h-N3zCFKUAHqp2qyULixKMedKQ5rH25emRmxB_NlO5Qq4ky4zKaHncl2-3bPq-yS7eh1pG0yNCHPJxGwpmHWAy0ggqg6lGe9cBSX1Vtd"
            />
          </div>
        </div>
      </div>
    </motion.header>
  );
};
