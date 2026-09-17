"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { TiltCard } from "@/modules/portal/shared/components/tilt-card";
import { ArrowRight } from "lucide-react";
import type { PublicNews } from "@/modules/portal/news/actions/news.action";

interface ActualidadSectionProps {
  news?: PublicNews[];
}

export function ActualidadSection({ news = [] }: ActualidadSectionProps) {
  if (news.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-center justify-between">
        <h2 className="font-heading text-4xl font-700 uppercase tracking-tight text-oxford sm:text-5xl">
          Actualidad
        </h2>
        <Link
          href="/present"
          className="group hidden items-center gap-2 text-sm font-600 uppercase tracking-wide text-neon transition-colors hover:text-neon/80 sm:flex"
        >
          Ver todo el blog
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {news.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <Link href={`/present/${item.slug}`} className="block h-full">
              <TiltCard className="group relative h-96 w-full overflow-hidden rounded-3xl border border-border bg-card shadow-neon-soft transition-shadow hover:shadow-neon">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-oxford/20 flex items-center justify-center">
                    <span className="text-oxford/50">CAN</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-oxford/95 via-oxford/50 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  {item.category && (
                    <span className="mb-3 w-fit rounded-full bg-neon/20 px-3 py-1 text-xs font-600 uppercase tracking-wider text-neon backdrop-blur-md">
                      {item.category}
                    </span>
                  )}
                  <h3 className="mb-2 font-heading text-xl font-700 leading-tight text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-500 text-white/80 line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/present"
          className="inline-flex items-center gap-2 rounded-full border border-neon px-6 py-2.5 text-sm font-600 uppercase tracking-wide text-neon transition-colors hover:bg-neon/10"
        >
          Ver todo el blog
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
