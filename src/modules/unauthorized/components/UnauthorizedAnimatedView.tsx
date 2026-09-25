"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { ParticlesBackground } from "@/ui";
import { ButtonRedirectBack } from "./ButtonRedirectBack";
import { ButtonRedirectHome } from "./ButtonRedirectHome";

export const UnauthorizedAnimatedView = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const imageContainerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const floatAnimation = {
    y: [0, -8, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  return (
    <main className="min-h-dvh bg-background flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* 403 Gran Marca de Agua */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.02, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-[35vw] font-black text-foreground tracking-tighter leading-none"
        >
          403
        </motion.span>
      </div>

      {/* Partículas Reutilizadas */}
      <div className="absolute inset-0 z-0 opacity-40">
        <ParticlesBackground />
      </div>

      {/* Glows Ambientales para profundidad (Premium SaaS feel) */}
      <div className="absolute top-0 left-1/4 w-[50vw] h-[50vw] max-w-175 max-h-175 bg-danger/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[40vw] h-[40vw] max-w-150 max-h-150 bg-accent/5 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none z-0" />

      {/* Card Principal con Glassmorphism */}
      <motion.div
        className="relative z-10 flex flex-col items-center w-full max-w-lg text-center bg-background/50 dark:bg-background/20 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2rem] p-6 sm:p-10 lg:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgb(0,0,0,0.3)] ring-1 ring-black/5 dark:ring-white/10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge Superior */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-danger/10 border border-danger/20 text-danger text-xs sm:text-sm font-medium tracking-wide shadow-inner"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-danger"></span>
          </span>
          403 &bull; Protected Route
        </motion.div>

        {/* Ilustración Central con animación de Flotación */}
        <motion.div
          variants={imageContainerVariants}
          className="mb-8 relative w-45 h-45 sm:w-55 sm:h-55 md:w-65 md:h-65"
        >
          <motion.div
            animate={floatAnimation}
            className="w-full h-full relative"
          >
            <Image
              src="/images/unauthorized.png"
              alt="Escudo de seguridad restringido"
              fill
              className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)]"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Título y Descripción con mejor jerarquía */}
        <motion.div variants={itemVariants} className="space-y-4 mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Acceso restringido
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-85 leading-relaxed mx-auto">
            No tienes permisos para acceder a esta sección. Si crees que esto es
            un error, comunícate con un administrador del sistema.
          </p>
        </motion.div>

        {/* Botón Principal (Premium Hover & Focus) */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <ButtonRedirectBack />
          </motion.div>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <ButtonRedirectHome />
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
};
