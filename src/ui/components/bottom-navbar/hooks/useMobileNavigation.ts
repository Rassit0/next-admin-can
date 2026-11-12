import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import { isNavigationItemActive } from "@/ui/components/navigation/navigation-url";

export const useMobileNavigation = (items: NavItem[], urlBase?: string) => {
  const [hidden, setHidden] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ocultar Navbar al scrollear hacia abajo (sin interferir si el drawer está abierto)
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isMoreOpen) return;

    const previous = scrollY.getPrevious() || 0;
    const direction = latest - previous;
    const isAtBottom =
      typeof window !== "undefined" &&
      window.innerHeight + latest >= document.body.scrollHeight - 50;

    if (direction > 0 && latest > 70 && !isAtBottom) {
      setHidden(true);
    } else if (direction < 0 || isAtBottom) {
      setHidden(false);
    }
  });

  // 1. Filtrar elementos visibles en móvil
  const visibleItems = items.filter((item) => item.mobile?.visible !== false);

  // 2. Ordenar por prioridad (mayor primero), luego posición, luego orden original
  const itemsWithIndex = visibleItems.map((item, index) => ({ item, index }));
  const sortedItems = itemsWithIndex
    .sort((a, b) => {
      const priorityA = a.item.mobile?.priority ?? 0;
      const priorityB = b.item.mobile?.priority ?? 0;
      if (priorityB !== priorityA) return priorityB - priorityA;

      const positionA = a.item.mobile?.position ?? 0;
      const positionB = b.item.mobile?.position ?? 0;
      if (positionA !== positionB) return positionA - positionB;

      return a.index - b.index;
    })
    .map((x) => x.item);

  // 3. Seleccionar los primeros 4 accesos prioritarios para la barra inferior
  const MAX_MAIN_ITEMS = 4;
  const showMoreButton = sortedItems.length > MAX_MAIN_ITEMS;

  const mainItems = showMoreButton
    ? sortedItems.slice(0, MAX_MAIN_ITEMS)
    : sortedItems;
  const moreItems = showMoreButton ? sortedItems.slice(MAX_MAIN_ITEMS) : [];

  // Ruta activa
  const fromContext = searchParams.get("from");

  const isItemActive = (item: NavItem) =>
    isNavigationItemActive(pathname, item.href, urlBase, fromContext);

  const isMoreActive = moreItems.some(isItemActive);

  return {
    mainItems,
    moreItems,
    drawerItems: visibleItems,
    hidden,
    isMoreOpen,
    setIsMoreOpen,
    isItemActive,
    isMoreActive,
    showMoreButton,
  };
};
