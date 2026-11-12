import { NavGroupKey, NavItem } from "@/ui/interfaces/sidebar/sidebar";

export interface NavGroupDefinition {
  key: NavGroupKey;
  label: string;
}

export const NAV_GROUP_DEFINITIONS: readonly NavGroupDefinition[] = [
  { key: "general", label: "General" },
  { key: "sports", label: "Deportivo" },
  { key: "academic", label: "Académico" },
  { key: "finance", label: "Finanzas" },
  { key: "admin", label: "Administración" },
] as const;

export interface NavGroupSection<T extends NavItem = NavItem> {
  key: NavGroupKey | "ungrouped";
  label: string | null;
  items: T[];
}

/**
 * Organiza los elementos de navegación en grupos funcionales compartidos
 * manteniendo el orden interno de cada grupo y omitiendo grupos vacíos.
 * Cuando los elementos no declaran `group` (ej. sub-navegación Web),
 * se devuelven en una única sección sin encabezado (`label: null`).
 */
export function groupNavigationItems<T extends NavItem>(
  items: T[],
): NavGroupSection<T>[] {
  if (items.length === 0) return [];

  const buckets = new Map<NavGroupKey, T[]>();
  const ungrouped: T[] = [];

  for (const item of items) {
    if (item.group) {
      const existing = buckets.get(item.group);
      if (existing) {
        existing.push(item);
      } else {
        buckets.set(item.group, [item]);
      }
    } else {
      ungrouped.push(item);
    }
  }

  const sections: NavGroupSection<T>[] = [];

  for (const def of NAV_GROUP_DEFINITIONS) {
    const groupItems = buckets.get(def.key);
    if (groupItems && groupItems.length > 0) {
      sections.push({
        key: def.key,
        label: def.label,
        items: groupItems,
      });
    }
  }

  if (ungrouped.length > 0) {
    sections.push({
      key: "ungrouped",
      label: null,
      items: ungrouped,
    });
  }

  return sections;
}

export function findActiveNavGroup<T extends NavItem>(
  sections: NavGroupSection<T>[],
  isActive: (item: T) => boolean,
): NavGroupKey | null {
  for (const section of sections) {
    if (section.key === "ungrouped") continue;
    if (section.items.some(isActive)) {
      return section.key;
    }
  }
  return null;
}

