"use client";

import { motion } from "framer-motion";
import { Droplet, Hexagon, Shield, Star, Zap } from "lucide-react"; // Using lucide icons as mock sponsor logos

export function SponsorsSection() {
  const sponsors = [
    { id: "s1", icon: Shield, name: "Sponsor 1" },
    { id: "s2", icon: Zap, name: "Sponsor 2" },
    { id: "s3", icon: Hexagon, name: "Sponsor 3" },
    { id: "s4", icon: Droplet, name: "Sponsor 4" },
    { id: "s5", icon: Star, name: "Sponsor 5" },
  ];

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
            Sponsors 2026
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 lg:gap-24">
          {sponsors.map((sponsor, idx) => (
            <motion.div
              key={sponsor.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="flex items-center justify-center transition-transform hover:scale-110"
              title={sponsor.name}
            >
              <sponsor.icon
                className="h-16 w-16 text-white sm:h-20 sm:w-20"
                strokeWidth={1.5}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
