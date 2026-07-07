"use client";
import { Button } from "@heroui/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";

// CONSTANTE DE INGENIERÍA: Espacio que queremos dejar al final (en píxeles)
// Ej: 16px es un espacio estándar de Tailwind (p-4 o m-4)
const FLOATING_MARGIN_BOTTOM = 16;

interface Props {
  className?: string;
  icon?: React.ReactNode;
  onPress: () => void;
  text?: string;
}
export const ButtonFloating = ({ className, icon, onPress, text }: Props) => {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  const buttonRef = useRef<HTMLDivElement>(null);
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const calculateOffset = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceToBottom = viewportHeight - rect.bottom;
        const finalMoveDistance = distanceToBottom - FLOATING_MARGIN_BOTTOM;
        setYOffset(Math.max(0, finalMoveDistance));
      }
    };

    calculateOffset();
    window.addEventListener("resize", calculateOffset);
    return () => window.removeEventListener("resize", calculateOffset);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const direction = latest - previous;

    // 1. Detectar si estamos en el fondo
    const isAtBottom =
      window.innerHeight + latest >= document.body.scrollHeight - 50;

    // 2. Jerarquía de Lógica (Prioridad)

    // A. Prioridad 1: Si estamos al fondo -> Visible
    if (isAtBottom) {
      setHidden(false);
      return;
    }

    // B. Prioridad 2: Si estamos en el tope (o cerca) -> Visible
    if (latest <= 70) {
      setHidden(false);
      return;
    }

    // C. Prioridad 3: Lógica de dirección (Solo si estamos en el medio)
    if (direction > 0) {
      setHidden(true); // Bajando -> Ocultar/Mover abajo
    } else {
      setHidden(false); // Subiendo -> Mostrar/Retornar
    }
  });

  return (
    <motion.div
      ref={buttonRef}
      variants={{
        visible: {
          y: 0,
          scale: 1,
          transition: { type: "spring", stiffness: 300, damping: 22 },
        },
        hidden: {
          y: yOffset, // Movemos la distancia ajustada
          scale: 0.92, // Pequeña compresión visual
          transition: { type: "spring", stiffness: 120, damping: 20 },
        },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      // Mantenemos tu posicionamiento original
      className={`fixed bottom-20 right-4 z-40 overflow-visible ${className}`}
    >
      <Button
        isIconOnly={text ? false : true}
        variant="primary"
        onPress={onPress}
      >
        {icon}
        {text}
      </Button>
    </motion.div>
  );
};
