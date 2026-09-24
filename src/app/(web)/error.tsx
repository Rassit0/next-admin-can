"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ServerCrash, RefreshCcw } from "lucide-react";
import { Magnetic } from "@/modules/portal/shared/components/magnetic";
import { useEffect } from "react";

export default function WebError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Loguear el error solo en consola de desarrollo
    console.error("Portal Error Boundary atrapó:", error);
  }, [error]);

  const isNetworkError =
    error.message.includes("conexión") ||
    error.message.includes("fetch") ||
    error.message.includes("503");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <ServerCrash className="h-24 w-24 text-primary/20 mb-4" />
        <h1 className="font-heading text-7xl font-700 tracking-tighter text-primary/10 mb-2">
          {isNetworkError ? "503" : "500"}
        </h1>
        <h2 className="mt-4 font-heading text-3xl font-700 uppercase tracking-tight text-primary sm:text-4xl">
          {isNetworkError ? "Servidor en Mantenimiento" : "Algo salió mal"}
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground text-pretty">
          {isNetworkError
            ? "No pudimos establecer conexión con los servidores del Club. Es posible que estemos realizando labores de mantenimiento o que haya un problema temporal en la red."
            : "Ocurrió un error inesperado al cargar esta pi¡gina. Por favor, intenta de nuevo mi¡s tarde."}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Magnetic as="div">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-background px-6 py-3.5 text-sm font-600 uppercase tracking-wide text-primary transition-all hover:bg-primary/5 w-full sm:w-auto"
            >
              <RefreshCcw className="h-4 w-4" />
              Reintentar
            </button>
          </Magnetic>

          <Link href="/">
            <Magnetic as="div">
              <button className="neon-perimeter flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-neon px-8 py-3.5 text-sm font-600 uppercase tracking-wide text-primary transition-all hover:shadow-neon">
                Volver al Inicio
              </button>
            </Magnetic>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
