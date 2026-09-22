import { itemsNavigation } from "@/config/navigation";
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
  // Para las rutas web (que no están en itemsNavigation directamente en el index de web, pero las moví al objeto web), 
  // primero buscamos en itemsNavigation y luego en itemsWebNavigation
  let moduleItem = itemsNavigation.find((item) => item.id === moduleId);
  
  // Como fallback para web si es llamado directamente con IDs antiguos
  if (!moduleItem && moduleId.startsWith("web-")) {
     // En caso de que se haya llamado como module con un ID de web antiguo, aunque ya están en routes.
     return false;
  }

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
