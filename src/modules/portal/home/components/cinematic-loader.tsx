"use client";

import { motion } from "framer-motion";
import { Crest } from "@/modules/portal/shared/components/crest";

export function CinematicLoader() {
  // 0: Escudo exterior, 1: Escudo interno, 2: Letra C, 3: Letra A, 4: Letra N, 5: Estrella superior
  const paths = [
    "M60 10 L112 28 V72 C112 105 89 128 60 138 C31 128 8 105 8 72 V28 Z", // Escudo Exterior
    "M60 18 L104 33 V69 C104 98 84 118 60 127 C36 118 16 98 16 69 V33 Z", // Línea Interna
    "M46 54 H36 V92 H46", // Letra C
    "M54 92 V54 H66 V92 M54 73 H66", // Letra A
    "M74 92 V54 L86 92 V54", // Letra N
    "M60 22 l3.5 7.2 8 .9 -5.8 5.6 1.4 7.9 -7.1 -3.7 -7.1 3.7 1.4 -7.9 -5.8 -5.6 8 -.9 Z", // Estrella
  ];

  return (
    <motion.div
      className="fixed h-screen inset-0 z-[100] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.7, duration: 0.5, ease: "easeInOut" }}
      style={{ pointerEvents: "none" }}
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          className="text-neon drop-shadow-[0_0_25px_var(--neon)]"
          initial={{ opacity: 0.9 }}
        >
          <svg
            viewBox="0 0 120 140"
            fill="none"
            className="h-36 w-32"
            aria-label="Club Atlético Nacional - CAN"
          >
            {paths.map((d, i) => {
              // Ajustes de grosor específicos por elemento
              let strokeWidth = 3;
              if (i === 0) strokeWidth = 4.5; // Escudo exterior más fuerte
              if (i === 1) strokeWidth = 1.5; // Línea elegante interna
              if (i === 5) strokeWidth = 2; // Estrella detallada
              return (
                <motion.path
                  key={i}
                  d={d}
                  stroke="currentColor"
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: i < 2 ? 1.4 : 0.9, // Los escudos se dibujan más lento, las letras más rápido
                    delay: 0.1 + i * 0.22, // Cascada perfecta entre trazos
                    ease: [0.22, 1, 0.36, 1], // Curva de velocidad "cubic-bezier" ultra suave
                  }}
                />
              );
            })}
          </svg>
        </motion.div>
      </motion.div>

      <motion.p
        className="mt-6 font-heading text-sm font-600 uppercase tracking-[0.5em] text-primary"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        Club Atlético Nacional
      </motion.p>
    </motion.div>
  );
}
