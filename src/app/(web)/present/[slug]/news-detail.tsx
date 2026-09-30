import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react";
import { PublicNewsDetail } from "@/modules/portal/news/actions/news.action";
import { Render } from "@puckeditor/core";
import { serverConfig } from "@/modules/cms/news/components/puck/config.server";

export function NewsDetail({ 
  article, 
  puckConfig 
}: { 
  article: PublicNewsDetail; 
  puckConfig?: any;
}) {
  const isStructured =
    article.structuredContent && article.contentSchemaVersion === 1;

  // Render legacy content if not structured
  const legacyContent = !isStructured && (
    <div className="prose prose-lg max-w-none text-muted-foreground prose-headings:font-heading prose-headings:font-700 prose-headings:uppercase prose-headings:text-oxford prose-a:text-neon prose-img:rounded-2xl prose-img:border prose-img:border-border">
      <p className="text-xl font-500 leading-relaxed text-oxford/80">
        {article.excerpt}
      </p>
      <div dangerouslySetInnerHTML={{ __html: article.content || "" }} />
    </div>
  );

  const structuredRenderer = isStructured && (
    <div className="puck-render-container">
      <p className="text-xl font-500 leading-relaxed text-oxford/80 mb-8">
        {article.excerpt}
      </p>
      <Render config={(puckConfig || serverConfig) as any} data={article.structuredContent} />
    </div>
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <Link
        href="/present"
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
              {new Date(article.publishedAt).toLocaleDateString("es-ES")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(article.publishedAt).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {article.authorName || "Club Atlético Nacional"}
            </span>
          </div>
        </div>

        <h1 className="font-heading text-4xl font-700 leading-tight tracking-tight text-oxford sm:text-5xl lg:text-6xl">
          {article.title}
        </h1>
      </div>

      {/* Hero Image */}
      {article.imageUrl && (
        <div className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl border border-border shadow-neon-soft">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      {isStructured ? structuredRenderer : legacyContent}

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-600 uppercase text-muted-foreground">
            Etiquetas:
          </span>
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
