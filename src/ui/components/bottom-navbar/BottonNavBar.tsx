"use client";
import { itemsNavigation } from "@/config";
import React, { useState } from "react";
import { Item } from "./Item";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

interface Props {
  items: NavItem[];
  urlBase?: string;
}

export const BottonNavBar = ({ items, urlBase }: Props) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const direction = latest - previous;

    // Cálculo para saber si estamos en el final de la página
    const isAtBottom =
      window.innerHeight + latest >= document.body.scrollHeight - 50;

    // 1. Ocultar si bajamos (direction > 0) Y NO estamos en el fondo
    if (direction > 0 && latest > 70 && !isAtBottom) {
      setHidden(true);
    }
    // 2. Mostrar si subimos O si estamos en el fondo
    else if (direction < 0 || isAtBottom) {
      setHidden(false);
    }
  });
  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "100%" }, // 100% baja la barra fuera de la vista
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        // className="md:hidden fixed bottom-0 left-0 w-full z-50"
        className="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-100 dark:border-slate-800/50 shadow-[0_-12px_32px_rgba(25,28,29,0.06)] rounded-t-2xl flex justify-start items-center px-4 py-4 pb-safe space-x-2 overflow-x-auto "
      >
        {items.map((item, index) => (
          <Item key={index} item={item} index={index} urlBase={urlBase} />
        ))}
      </motion.nav>
    </>
  );
};
