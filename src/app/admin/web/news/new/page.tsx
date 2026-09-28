import { HeaderPage } from "@/ui";
import { NewsEditorForm } from "@/modules/cms/news/components/puck/NewsEditorForm";
import crypto from "crypto";

export default function NewNewsPage() {
  const uploadSessionId = crypto.randomUUID();

  return (
    <>
      <div className="space-y-8">
        <HeaderPage
          title="Crear Nueva Noticia"
          description="Completa la información general y redacta el artículo."
        />
        <NewsEditorForm mode="create" uploadSessionId={uploadSessionId} />
      </div>
    </>
  );
}
