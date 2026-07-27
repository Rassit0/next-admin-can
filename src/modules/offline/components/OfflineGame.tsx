"use client";
import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOfflineGame } from "../hooks";

export const OfflineGame = () => {
  const { isPlaying, isGameOver, score, highScore, playerY, obstacles, jump } =
    useOfflineGame();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump]);

  return (
    <div
      className="relative w-full max-w-md h-48 mx-auto mt-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden cursor-pointer shadow-[inset_0_2px_15px_rgba(0,0,0,0.03)] touch-none"
      onClick={jump}
    >
      {/* Marcador */}
      <div className="absolute top-4 right-4 flex gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono z-10">
        <span>HI: {highScore.toString().padStart(5, "0")}</span>
        <span className="text-sky-500 dark:text-sky-400">
          {score.toString().padStart(5, "0")}
        </span>
      </div>

      {/* Escenario / Línea del suelo */}
      <div className="absolute bottom-7 left-0 w-full h-0.5 bg-slate-200/80 dark:bg-slate-700/80 rounded-full" />

      {/* Jugador (El Balón CAN) */}
      <motion.div
        className="absolute w-6 h-6 bg-emerald-500 rounded-full shadow-[0_4px_10px_rgba(16,185,129,0.4)] flex items-center justify-center overflow-hidden z-10"
        style={{ left: 50, top: playerY - 24 }}
        animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      >
        {/* Patrón decorativo del balón */}
        <div className="w-2 h-2 bg-white/90 rounded-sm rotate-45" />
      </motion.div>

      {/* Obstáculos (Conos) */}
      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className="absolute bg-orange-500 rounded-t-lg border-b-4 border-orange-600 shadow-sm z-10"
          style={{
            left: obs.x,
            top: 150 - obs.height,
            width: obs.width,
            height: obs.height,
          }}
        >
          {/* Cinta reflectiva del cono */}
          <div className="w-full h-1/4 bg-white/40 mt-2" />
        </div>
      ))}

      {/* Overlays de inicio y fin */}
      <AnimatePresence>
        {!isPlaying && !isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center z-20 bg-white/10 dark:bg-black/10 backdrop-blur-[2px]"
          >
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-300 animate-pulse bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-full shadow-sm">
              Toca o presiona Espacio para jugar
            </p>
          </motion.div>
        )}

        {isGameOver && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-white/50 dark:bg-black/50 backdrop-blur-sm"
          >
            <span className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">
              ¡Auch!
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Puntuación:{" "}
              <span className="text-sky-600 dark:text-sky-400">{score}</span>
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-4 animate-pulse bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm">
              Toca para intentarlo de nuevo
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
