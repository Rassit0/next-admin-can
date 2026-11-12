const EXTERNAL_PROTOCOL_REGEX = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;

function normalizeBase(urlBase?: string): string {
  if (!urlBase) return "";
  const trimmed = urlBase.trim();
  if (trimmed === "/") return "";
  return trimmed.replace(/\/+$/, "");
}

function stripBasePrefix(pathname: string, urlBase?: string): string {
  const base = normalizeBase(urlBase);
  if (!base) return pathname || "/";
  if (pathname === base) return "/";
  if (pathname.startsWith(`${base}/`)) {
    return pathname.slice(base.length) || "/";
  }
  return pathname || "/";
}

function getFirstSegment(path: string): string | null {
  const segments = path.split("/").filter(Boolean);
  return segments[0] ?? null;
}

/**
 * Resolves a navigation target against an optional base path without duplicating
 * prefixes on root-relative (`/`) or external URLs.
 */
export function resolveNavigationHref(href: string, urlBase?: string): string {
  const trimmed = href.trim();
  const base = normalizeBase(urlBase);

  if (!trimmed) {
    return base || "/";
  }

  if (EXTERNAL_PROTOCOL_REGEX.test(trimmed) || trimmed.startsWith("/")) {
    return trimmed;
  }

  const cleanHref = trimmed.replace(/^\/+/, "");
  if (!base) {
    return cleanHref;
  }

  return `${base}/${cleanHref}`;
}

/**
 * Determines whether a navigation item matches the active route, preserving
 * `?from=` context overrides for relative module routes without misclassifying
 * cross-shell absolute routes (`/` or `/teacher`).
 */
export function isNavigationItemActive(
  pathname: string,
  itemHref: string,
  urlBase?: string,
  fromContext?: string | null,
): boolean {
  const targetHref = resolveNavigationHref(itemHref, urlBase);

  if (EXTERNAL_PROTOCOL_REGEX.test(targetHref)) {
    return false;
  }

  const base = normalizeBase(urlBase);
  const isCrossShellTarget =
    base.length > 0 &&
    targetHref !== base &&
    !targetHref.startsWith(`${base}/`);

  if (isCrossShellTarget) {
    if (targetHref === "/") {
      return pathname === "/";
    }
    return pathname === targetHref || pathname.startsWith(`${targetHref}/`);
  }

  const relativeCurrent = stripBasePrefix(pathname, urlBase);
  const relativeTarget = stripBasePrefix(targetHref, urlBase);
  const currentSegment = getFirstSegment(relativeCurrent);
  const itemSegment = getFirstSegment(relativeTarget);

  if (fromContext) {
    return itemSegment !== null && fromContext === itemSegment;
  }

  if (itemSegment === null) {
    return pathname === targetHref;
  }

  return (
    currentSegment === itemSegment ||
    pathname === targetHref ||
    pathname.startsWith(`${targetHref}/`)
  );
}

