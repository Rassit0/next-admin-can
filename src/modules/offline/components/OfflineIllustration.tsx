"use client";
import React from "react";
import { motion } from "framer-motion";
import { OfflineParticles } from "./OfflineParticles";

export const OfflineIllustration = () => {
  return (
    <div className="relative flex justify-center items-center w-full h-48 mb-6">
      {/* Fondos radiales premium (Blur) */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-32 h-32 bg-sky-400/20 dark:bg-sky-500/10 rounded-full blur-2xl"
      />
      <motion.div
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute w-40 h-40 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl"
      />

      {/* Partículas orbitales animadas */}
      <OfflineParticles />

      {/* Isla Flotante (Icono Principal) */}
      <motion.div
        animate={{ y: [-8, 8, -8] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-24 h-24 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/50 dark:border-slate-700/50 shadow-2xl rounded-[2rem] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-br from-sky-100/40 to-transparent dark:from-sky-900/20" />

        {/* Nube desconectada SVG puro para evitar dependencias fallidas */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-sky-500 dark:text-sky-400 drop-shadow-md relative z-10"
        >
          <path d="M22 17v-1.5A4.5 4.5 0 0 0 17.5 11h-.63a7 7 0 0 0-13.74 1.5M2 17v-1.5A4.5 4.5 0 0 1 6.5 11h.63" />
          <line
            x1="2"
            y1="2"
            x2="22"
            y2="22"
            className="text-slate-300 dark:text-slate-600"
          />
        </svg>

        {/* Ondas de radar simulando búsqueda de red */}
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 border-2 border-sky-400/50 dark:border-sky-400/30 rounded-[2rem]"
        />
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.25,
          }}
          className="absolute inset-0 border-2 border-sky-400/50 dark:border-sky-400/30 rounded-[2rem]"
        />
      </motion.div>
    </div>
  );
};
