"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export const OfflineReconnect = () => {
  const { justReconnected } = useOnlineStatus();

  return (
    <AnimatePresence>
      {justReconnected && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9, x: "-50%" }}
          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
          exit={{ opacity: 0, y: 20, scale: 0.9, x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-10 left-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-emerald-500/90 dark:bg-emerald-500 backdrop-blur-md text-white rounded-full shadow-2xl font-medium border border-emerald-400"
        >
          {/* Tick SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>Conexión restaurada</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
