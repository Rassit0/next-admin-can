"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Magnetic } from "@/modules/portal/shared/components/magnetic";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-heading text-9xl font-700 tracking-tighter text-oxford/10">
          404
        </h1>
        <h2 className="mt-4 font-heading text-3xl font-700 uppercase tracking-tight text-oxford sm:text-4xl">
          Página no encontrada
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground text-pretty">
          Lo sentimos, la ruta a la que intentas acceder no existe o fue movida.
          Puedes regresar al inicio para seguir navegando.
        </p>

        <div className="mt-8 flex justify-center">
          <Link href="/">
            <Magnetic as="div">
              <button className="neon-perimeter flex items-center gap-3 rounded-full bg-neon px-8 py-3.5 text-sm font-600 uppercase tracking-wide text-oxford transition-all hover:shadow-neon">
                Volver al Inicio
                <ChevronRight className="h-5 w-5" />
              </button>
            </Magnetic>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
