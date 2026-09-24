"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { TiltCard } from "@/modules/portal/shared/components/tilt-card";
import { cn } from "@/lib/utils";
import type {
  PublicNews,
  PublicNewsCategory,
} from "@/modules/portal/news/actions/news.action";
import { useRouter, useSearchParams } from "next/navigation";

interface NoticiasProps {
  initialNews?: PublicNews[];
  categories?: PublicNewsCategory[];
  initialCategoryId?: string;
}

export function Noticias({
  initialNews = [],
  categories = [],
  initialCategoryId,
}: NoticiasProps) {
  const router = useRouter();

  // Agregamos "Todas" al inicio de las categorías
  const dynamicFilters = [
    { label: "Todas", value: "Todas" },
    ...categories.map((c) => ({ label: c.name, value: c.id })),
  ];

  const [filter, setFilter] = useState(initialCategoryId || "Todas");

  // Si filtramos del lado del servidor (initialCategoryId), initialNews ya viene filtrado,
  // pero si el usuario selecciona otro filtro en el cliente, aplicamos el filtrado local.
  const filtered = initialNews.filter(
    (n) =>
      filter === "Todas" || n.categoryId === filter || n.category === filter,
  );

  const handleFilterChange = (value: string) => {
    setFilter(value);

    // Opcional: actualizar URL sin recargar para que pueda ser compartida
    if (value === "Todas") {
      router.push("/present", { scroll: false });
    } else {
      router.push(`/present?categoryId=${value}`, { scroll: false });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mb-8">
        <h1 className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl">
          Central de <span className="text-neon text-glow-neon">Anuncios</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
          Toda la actualidad del club: resultados, comunicados institucionales y
          novedades de cada disciplina.
        </p>
      </div>

      {/* Faceted magnetic filters */}
      <div className="mb-10 flex flex-wrap gap-3">
        {dynamicFilters.map((f) => {
          const isActive = filter === f.value;
          return (
            <motion.button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative rounded-full border px-5 py-2 text-sm font-600 uppercase tracking-wide transition-colors",
                isActive
                  ? "border-neon text-white"
                  : "border-border text-muted-foreground hover:border-neon hover:text-neon",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="filter-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-neon shadow-neon"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {f.label}
            </motion.button>
          );
        })}
      </div>

      {/* Magazine grid */}
      <motion.div
        layout
        className="grid auto-rows-[1fr] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              layout
              layoutId={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className={cn(index === 0 && "sm:col-span-2 lg:row-span-2")}
            >
              <Link href={`/actualidad/${item.slug}`} className="block h-full">
                <TiltCard
                  intensity={index === 0 ? 6 : 9}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-neon"
                >
                  <div
                    className={cn(
                      "relative w-full overflow-hidden",
                      index === 0 ? "aspect-16/10" : "aspect-16/10",
                    )}
                  >
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="text-primary/50">CAN</span>
                      </div>
                    )}
                    <span
                      className={cn(
                        "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-600 uppercase tracking-wide backdrop-blur-md",
                        "bg-neon/90 text-primary",
                      )}
                    >
                      {item.category || "Noticia"}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-xs font-600 uppercase tracking-[0.18em] text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString("es-ES")}
                    </span>
                    <h3
                      className={cn(
                        "mt-2 font-heading font-700 uppercase leading-tight tracking-tight text-primary text-balance",
                        index === 0 ? "text-2xl sm:text-3xl" : "text-lg",
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.excerpt}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-600 uppercase tracking-wide text-neon">
                      Leer nota <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </TiltCard>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
