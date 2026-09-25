"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export const OfflineParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generar partículas de forma segura solo en el cliente
    // Esto evita el error de "Hydration Mismatch" (SSR vs CSR) causado por Math.random()
    const generated = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 240 - 120,
      y: Math.random() * 180 - 90,
      duration: Math.random() * 3 + 3,
      delay: Math.random() * 2,
    }));
    setParticles(generated);
  }, []);

  if (particles.length === 0) {
    return null; // No renderiza nada en el servidor
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute bg-sky-400/50 dark:bg-sky-400/30 rounded-full"
          style={{ width: p.size, height: p.size }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.8, 0],
            x: p.x,
            y: p.y,
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
