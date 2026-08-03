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

  let message = error.message || "Ocurrió un error inesperado al cargar la vista.";
  let path = undefined;

  try {
    const parsed = JSON.parse(error.message);
    if (parsed.message) {
      message = parsed.message;
      path = parsed.path;
    }
  } catch (e) {
    // No es un string JSON válido, mantener el mensaje original
  }

  return (
    <ErrorPage 
      message={message} 
      path={path}
    />
  );
}
