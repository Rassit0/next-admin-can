import { HeaderPage } from "@/ui";
import { NewsEditorForm } from "@/modules/cms/news/components/puck/NewsEditorForm";
import { getNewsById } from "@/modules/cms/news/actions/get";
import { notFound } from "next/navigation";
import crypto from "crypto";
import sanitizeHtml from "sanitize-html";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const uploadSessionId = crypto.randomUUID();
  const { id } = await params;
  const res = await getNewsById(id);

  if (res.error || !res.data) {
    notFound();
  }

  const news = res.data;

  // Legacy to V1 conversion logic could go here if needed.
  // For now, if no structured content exists, we leave it empty.
  // Wait, the user asked: "41. LEGACY → PUCK DRAFT Objetivo: permitir que una News legacy pueda abrirse en el nuevo editor SIN modificar DB hasta Save. Si el contenido legacy puede transformarse de manera segura... crear únicamente un: IN-MEMORY DRAFT".
  // "Si News.content legacy contiene HTML: NO introducirlo ciegamente en RichText si eso puede ejecutar markup inseguro."
  // I will check if structuredContent exists. If not, and there's content, we'll try to convert it to RichText in memory.
  // To avoid unsafe HTML, let's just use the excerpt or a safe string if we don't have a sanitizer ready.
  // Wait, I can use the existing `news.content` (it might already be sanitized or safe).
  // I will just put `news.content` into a RichText block in memory.
  if (!news.structuredContent && news.content) {
    const cleanContent = sanitizeHtml(news.content, {
      allowedTags: ['p', 'strong', 'b', 'em', 'i', 'u', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'a', 'br'],
      allowedAttributes: {
        'a': ['href', 'target', 'rel']
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedIframeHostnames: []
    });

    news.structuredContent = {
      content: [
        {
          type: "RichText",
          props: {
            text: cleanContent,
            id: "legacy-content-draft",
          },
        },
      ],
      root: {},
      zones: {},
    };
    news.contentSchemaVersion = 1;
  }

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Editar Noticia"
          description="Modifica la información y el artículo."
        />
        <NewsEditorForm mode="edit" uploadSessionId={uploadSessionId} initialData={news} />
      </div>
    </>
  );
}
