"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRightIcon } from "lucide-react";

import type { IHomeDiscipline } from "@/modules/cms/home-disciplines";

const fallbackSections = [
  {
    title: "Básquetbol",
    href: "/teams/basketball",
  },
  {
    title: "Voleibol",
    href: "/teams/volleyball",
  },
];

export function EquiposEscuelaSection({
  disciplineBanners = [],
}: {
  disciplineBanners?: IHomeDiscipline[];
}) {
  const items =
    disciplineBanners.length > 0
      ? disciplineBanners.map((b) => ({
          title: b.title,
          href: b.redirectTo || "#",
        }))
      : fallbackSections;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center justify-center text-center">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-primary sm:text-5xl">
          Nuestras Disciplinas
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-500 text-muted-foreground">
          Descubre los deportes que ofrecemos, forma parte de nuestros equipos y
          lleva tu pasión al siguiente nivel.
        </p>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {items.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: idx * 0.15,
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            className="w-full"
          >
            <Link href={section.href} className="block w-full">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-lg border-2 border-neon/30 bg-primary px-8 py-8 shadow-[0_0_20px_rgba(0,255,170,0.15)] transition-all hover:border-neon hover:shadow-[0_0_35px_rgba(0,255,170,0.4)] sm:px-12 sm:py-10"
              >
                {/* Glow background effect */}
                <div className="absolute inset-0 bg-linear-to-r from-neon/0 via-neon/10 to-neon/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="relative z-10 font-heading text-3xl font-700 uppercase tracking-wider text-white sm:text-4xl">
                  {section.title}
                </span>

                <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-neon text-primary transition-transform duration-300 group-hover:translate-x-2 sm:h-16 sm:w-16">
                  <ArrowRightIcon className="h-7 w-7 stroke-3 sm:h-8 sm:w-8" />
                </div>
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
