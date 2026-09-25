import { NavigationConfig } from "@/config/navigation";

export interface PermissionRule {
  anyOf?: string[];
  allOf?: string[];
}

export const hasRequiredPermissions = (
  userPermissions: string[],
  rule?: PermissionRule,
): boolean => {
  // Si no hay regla, es de acceso público
  if (!rule || (!rule.anyOf && !rule.allOf)) {
    return true;
  }

  // Si requiere TODOS los permisos de la lista
  if (rule.allOf && rule.allOf.length > 0) {
    const hasAll = rule.allOf.every((p) => userPermissions.includes(p));
    if (!hasAll) return false;
  }

  // Si requiere AL MENOS UNO de la lista
  if (rule.anyOf && rule.anyOf.length > 0) {
    const hasAny = rule.anyOf.some((p) => userPermissions.includes(p));
    if (!hasAny) return false;
  }

  return true;
};

export const getAllowedChildRoutes = (
  moduleId: string,
  userPermissions: string[],
  config: NavigationConfig[],
) => {
  const module = config.find((m) => m.id === moduleId);
  if (!module || !module.routes) return [];

  return module.routes.filter((route) =>
    hasRequiredPermissions(userPermissions, route.requiredPermissions),
  );
};

export const getFirstAllowedChildRoute = (
  moduleId: string,
  userPermissions: string[],
  config: NavigationConfig[],
) => {
  const allowed = getAllowedChildRoutes(moduleId, userPermissions, config);
  // Un "default candidate" en este contexto asume que debe poder mostrarse
  // (es decir, no es una ruta dinámica u oculta, a menos que el flujo lo permita).
  // Por requerimiento, evitamos auto-navegar a rutas como [personId].
  return allowed.find(
    (route) => !route.href.includes("[") && !route.href.includes("]"),
  );
};

export const filterNavigation = (
  items: NavigationConfig[],
  userPermissions: string[],
): NavigationConfig[] => {
  return items.reduce<NavigationConfig[]>((acc, item) => {
    // Si no tiene reglas de permisos o el id es 'dashboard', primero evaluamos parent access
    const hasParentAccess =
      !item.requiredPermissions ||
      hasRequiredPermissions(userPermissions, item.requiredPermissions);

    if (!hasParentAccess) return acc;

    // Smart Navigation Resolution para hijos
    let resolvedHref = item.href;

    if (item.routes && item.routes.length > 0) {
      if (item.entryStrategy === "firstAllowedChild") {
        const firstAllowed = getFirstAllowedChildRoute(
          item.id || "",
          userPermissions,
          items,
        );
        if (!firstAllowed) {
          // Si la estrategia exige ir al primer hijo pero no tiene permiso para ninguno,
          // se oculta el padre completamente.
          return acc;
        }
        // firstAllowed.href es absoluto (ej. "/admin/accounting/cash-flow")
        // Sidebar/BottomNav le agregan urlBase (ej. "/admin")
        // Removemos el prefijo "/admin/" para que quede relativo
        resolvedHref = firstAllowed.href.replace(/^\/admin\//, "");
      } else if (item.entryStrategy === "self") {
        // Mantiene el href original (ej. "quick-operations")
        resolvedHref = item.href;
      }
    }

    acc.push({ ...item, href: resolvedHref });
    return acc;
  }, []);
};
