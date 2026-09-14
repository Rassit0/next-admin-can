"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface PromoBannerProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  ctaHref?: string;
  className?: string;
}

export function PromoBanner({
  title,
  subtitle,
  image,
  ctaText,
  ctaHref,
  className = "",
}: PromoBannerProps) {
  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-4xl bg-oxford/90 shadow-xl"
      >
        <div className="absolute inset-0">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-linear-to-r from-oxford via-oxford/80 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-start justify-center px-8 py-12 md:px-16 md:py-20 lg:py-24">
          <h2 className="max-w-2xl font-heading text-3xl font-700 uppercase leading-tight tracking-tight text-white md:text-5xl lg:text-6xl text-balance">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-lg font-500 text-white/90 md:text-xl text-pretty">
            {subtitle}
          </p>

          {ctaText && ctaHref && (
            <div className="mt-8">
              <Link
                href={ctaHref}
                className="neon-perimeter inline-flex items-center justify-center rounded-full bg-neon px-8 py-3.5 text-sm font-700 uppercase tracking-wide text-oxford transition-all hover:shadow-neon hover:-translate-y-1"
              >
                {ctaText}
              </Link>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
