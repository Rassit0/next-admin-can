"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TiltCard } from "@/modules/web/shared/components/tilt-card";

const sections = [
  {
    title: "Básquetbol",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop",
    href: "/teams/basketball",
  },
  {
    title: "Voleibol",
    image: "https://images.unsplash.com/photo-1592656094267-764a45160876?q=80&w=800&auto=format&fit=crop",
    href: "/teams/volleyball",
  },
  {
    title: "Escuela CAN",
    image: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=800&auto=format&fit=crop",
    href: "/schools",
  },
];

export function EquiposEscuelaSection() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <Link href={section.href} className="block w-full h-full">
              <TiltCard className="group relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border bg-card shadow-neon-soft transition-all hover:shadow-neon">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-oxford/90 via-oxford/40 to-transparent transition-opacity group-hover:opacity-80" />
                
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-center">
                  <h3 className="font-heading text-3xl font-700 uppercase tracking-wide text-white drop-shadow-md">
                    {section.title}
                  </h3>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
