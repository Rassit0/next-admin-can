export function getSafeRedirectUrl(
  url: string | null | undefined,
  fallback: string = "/admin",
): string {
  if (!url) return fallback;

  // Aceptar rutas relativas vi¡lidas (empiezan con / pero no con //)
  if (url.startsWith("/") && !url.startsWith("//")) {
    return url;
  }

  // Rechazar URL externa o javascript:/data:
  return fallback;
}
