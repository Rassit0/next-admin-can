"use client";
import React, { useState } from "react";
import { motion, Variants } from "framer-motion";
import { OfflineIllustration } from "./OfflineIllustration";
import { OfflineGame } from "./OfflineGame";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
};

export const OfflineHero = () => {
  const [isShaking, setIsShaking] = useState(false);

  const handleRetry = () => {
    if (navigator.onLine) {
      window.location.reload();
    } else {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-lg mx-auto text-center z-10 relative px-6 py-8"
    >
      <motion.div variants={itemVariants}>
        <OfflineIllustration />
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3"
      >
        Conexión en pausa
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="text-[17px] font-medium text-slate-600 dark:text-slate-300 mb-2 leading-relaxed"
      >
        No te preocupes. Seguiremos aquí cuando Internet vuelva.
      </motion.p>

      <motion.p
        variants={itemVariants}
        className="text-sm text-slate-500 dark:text-slate-500 mb-8 max-w-sm mx-auto"
      >
        Tus funciones volverán a estar disponibles automáticamente en cuanto se
        restablezca la red.
      </motion.p>

      <motion.div variants={itemVariants}>
        <motion.button
          onClick={handleRetry}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          animate={
            isShaking
              ? { x: [-4, 4, -4, 4, 0], transition: { duration: 0.4 } }
              : {}
          }
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.18)] transition-shadow"
        >
          {/* Refresh SVG */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-80"
          >
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.59-9.21l5.67-1.16" />
          </svg>
          Intentar nuevamente
        </motion.button>
      </motion.div>

      <motion.div variants={itemVariants} className="mt-12 w-full">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Mientras esperas
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>
        <OfflineGame />
      </motion.div>
    </motion.div>
  );
};
