import { itemsNavigation, itemsWebNavigation } from "@/config/navigation";
import { hasRequiredPermissions } from "@/shared/helpers/permissions";

/**
 * Retorna true si el usuario tiene acceso al módulo según las reglas de NavigationConfig.
 * Si se especifica childRouteId, también verifica el acceso a esa subruta.
 * Si el módulo no existe, se deniega el acceso por defecto (fail-closed).
 */
export const hasModuleAccess = (
  moduleId: string,
  userPermissions: string[],
  childRouteId?: string
): boolean => {
  // Manejo especial para el módulo web que fue extraído a itemsWebNavigation
  if (moduleId === "web") {
    if (!childRouteId) return true;
    
    const childRoute = itemsWebNavigation.find((r: any) => r.id === childRouteId);
    if (!childRoute) return false;
    
    if (childRoute.requiredPermissions) {
      if (!hasRequiredPermissions(userPermissions, childRoute.requiredPermissions)) {
        return false;
      }
    }
    return true;
  }

  let moduleItem = itemsNavigation.find((item) => item.id === moduleId);
  
  if (!moduleItem) {
    return false; // Fail-closed
  }

  // Verificar primero si tiene acceso al módulo padre
  if (moduleItem.requiredPermissions) {
    if (!hasRequiredPermissions(userPermissions, moduleItem.requiredPermissions)) {
      return false;
    }
  }

  // Si se pide una ruta hija específica, verificarla
  if (childRouteId) {
    if (!moduleItem.routes) return false; // Fail-closed si no tiene rutas definidas
    const childRoute = moduleItem.routes.find((r) => r.id === childRouteId);
    if (!childRoute) return false; // Fail-closed
    
    if (childRoute.requiredPermissions) {
      if (!hasRequiredPermissions(userPermissions, childRoute.requiredPermissions)) {
        return false;
      }
    }
  }

  return true;
};
