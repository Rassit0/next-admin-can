"use client"; // Error boundaries must be Client Components

import { ErrorPage } from "@/ui";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Podrías registrar el error en un servicio como Sentry aquí
    console.error("Uncaught error caught by error.tsx:", error);
  }, [error]);

  return (
    <ErrorPage 
      message={error.message || "Ocurrió un error inesperado al cargar la vista."} 
    />
  );
}
