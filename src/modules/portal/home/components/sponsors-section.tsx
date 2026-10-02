"use client";

import { motion } from "framer-motion";
import { ISponsor } from "@/modules/cms/sponsors";
import Link from "next/link";
import Image from "next/image";

interface Props {
  sponsors?: ISponsor[];
}

export function SponsorsSection({ sponsors = [] }: Props) {
  if (sponsors.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-4xl bg-linear-to-r from-primary via-primary/95 to-primary p-8 sm:p-12 lg:p-16"
      >
        <div className="mb-10 text-center">
          <h3 className="font-heading text-xl font-700 uppercase tracking-widest text-white/90">
            Auspiciadores 2026
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-24">
          {sponsors.map((sponsor, idx) => {
            const Content = (
              <motion.div
                key={sponsor.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="flex items-center justify-center transition-transform hover:scale-110 h-24 w-48 sm:h-32 sm:w-64 relative"
                title={sponsor.name}
              >
                {/* Usamos un div con bg-center/contain o img normal */}
                <Image
                  src={sponsor.imageUrl}
                  alt={sponsor.name}
                  fill
                  sizes="(max-width: 768px) 128px, 160px"
                  className="object-contain drop-shadow-sm transition-all"
                />
              </motion.div>
            );

            if (sponsor.websiteUrl) {
              return (
                <Link key={sponsor.id} href={sponsor.websiteUrl} target="_blank">
                  {Content}
                </Link>
              );
            }
            return Content;
          })}
        </div>
      </motion.div>
    </section>
  );
}
