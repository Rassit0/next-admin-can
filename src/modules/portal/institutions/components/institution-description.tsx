"use client";

import { motion, Variants } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function InstitutionDescription() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="relative my-20 w-full overflow-hidden rounded-3xl border border-neon/30 bg-primary/90 px-8 py-16 shadow-2xl sm:px-12 md:py-24">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-neon/10 blur-[128px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-neon/10 blur-[128px]" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        {/* <motion.div variants={itemVariants} className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neon/20 ring-1 ring-neon">
            <span className="font-heading text-xl font-bold text-neon">C</span>
          </div>
        </motion.div> */}

        <motion.h2
          variants={itemVariants}
          className="mb-8 font-heading text-3xl font-700 uppercase tracking-widest text-white sm:text-4xl md:text-5xl"
        >
          Nuestra <span className="text-neon text-glow-neon">Institución</span>
        </motion.h2>

        <motion.div
          variants={itemVariants}
          className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-transparent via-neon to-transparent mb-10"
        />

        <div className="space-y-6 font-sans text-lg font-300 leading-relaxed text-slate-300 sm:text-xl sm:leading-loose">
          <motion.p variants={itemVariants}>
            Somos el corazón deportivo de la comunidad, una institución dedicada
            a fomentar el talento, la disciplina y los valores a través de la
            actividad física. Nuestro compromiso va más allá de las canchas:
            buscamos formar líderes, atletas íntegros y ciudadanos
            excepcionales.
          </motion.p>
          <motion.p variants={itemVariants}>
            Con una visión enfocada en la excelencia y un equipo de
            profesionales apasionados, ofrecemos un espacio dinámico donde
            deportistas de todas las edades pueden desarrollarse, competir y
            alcanzar su máximo potencial en un ambiente seguro, competitivo y
            familiar.
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="font-500 text-white italic mt-8 text-xl sm:text-2xl"
          >
            "No solo construimos deportistas, forjamos el futuro."
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}
