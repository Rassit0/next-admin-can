"use client";

import { motion } from "framer-motion";
import { Institution } from "../interfaces/institution.interface";

interface Props {
  institution: Institution;
}

export function InstitutionHeader({ institution }: Props) {
  return (
    <div className="mb-12 text-center md:mb-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl"
      >
        <span className="text-neon text-glow-neon">Club</span>{" "}
        {institution.name.replace("Club", "").trim()}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-4 text-muted-foreground mx-auto max-w-2xl text-lg uppercase tracking-widest font-600"
      >
        Tradicón y Excelencia Deportiva
      </motion.p>
    </div>
  );
}
