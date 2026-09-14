"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import type { PublicNewsDetail } from "@/modules/web/news/actions/news.action";

export function NewsDetailClient({ article }: { article: PublicNewsDetail }) {
  const publishDate = new Date(article.publishedAt);
  
  return (
    <article className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <Link
        href="/actualidad"
        className="mb-8 inline-flex items-center gap-2 text-sm font-600 uppercase tracking-wide text-neon transition-colors hover:text-neon/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Actualidad
      </Link>

      {/* Header Info */}
      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-neon/10 px-3 py-1 text-xs font-600 uppercase tracking-wide text-neon">
            {article.category || "Noticia"}
          </span>
          <div className="flex items-center gap-4 text-xs font-600 uppercase tracking-wide text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {publishDate.toLocaleDateString("es-ES")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {publishDate.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
            </span>
            {article.authorName && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {article.authorName}
              </span>
            )}
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl font-700 uppercase leading-tight tracking-tight text-oxford sm:text-5xl lg:text-6xl"
        >
          {article.title}
        </motion.h1>
      </div>

      {/* Hero Image */}
      {article.imageUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-neon-soft"
        >
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </motion.div>
      )}

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-a:text-neon prose-img:rounded-2xl prose-img:border prose-img:border-border"
      >
        <p className="text-xl font-500 leading-relaxed text-oxford/80">
          {article.excerpt}
        </p>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </motion.div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-600 uppercase text-muted-foreground">Etiquetas:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-600 uppercase tracking-wide text-oxford"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
