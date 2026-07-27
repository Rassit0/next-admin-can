import { useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

export const useMobileNavigation = (items: NavItem[], urlBase?: string) => {
  const [hidden, setHidden] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Ocultar Navbar al scrollear hacia abajo
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    const direction = latest - previous;
    const isAtBottom = typeof window !== "undefined" && window.innerHeight + latest >= document.body.scrollHeight - 50;

    if (direction > 0 && latest > 70 && !isAtBottom) {
      setHidden(true);
      setIsMoreOpen(false); // Cerrar menú Más al scrollear
    } else if (direction < 0 || isAtBottom) {
      setHidden(false);
    }
  });

  // Procesamiento de prioridad para móviles
  // 1. Eliminar los que explícitamente tienen mobile.visible = false
  const visibleItems = items.filter(item => item.mobile?.visible !== false);

  // 2. Ordenar por prioridad (mayor primero), luego posición, luego orden original
  // Conservamos el índice original para desempatar manteniendo el orden inicial
  const itemsWithIndex = visibleItems.map((item, index) => ({ item, index }));
  const sortedItems = itemsWithIndex.sort((a, b) => {
    const priorityA = a.item.mobile?.priority ?? 0;
    const priorityB = b.item.mobile?.priority ?? 0;
    if (priorityB !== priorityA) return priorityB - priorityA;

    const positionA = a.item.mobile?.position ?? 0;
    const positionB = b.item.mobile?.position ?? 0;
    if (positionA !== positionB) return positionA - positionB;

    return a.index - b.index;
  }).map(x => x.item);

  // 3. Seleccionar los primeros 4 para la barra principal y el resto para el menú "Más"
  const MAX_MAIN_ITEMS = 4;
  const showMoreButton = sortedItems.length > MAX_MAIN_ITEMS;
  
  // Si no exceden el máximo, mostrar todos como principales
  const mainItems = showMoreButton ? sortedItems.slice(0, MAX_MAIN_ITEMS) : sortedItems;
  const moreItems = showMoreButton ? sortedItems.slice(MAX_MAIN_ITEMS) : [];

  // Lógica para determinar si un elemento o ruta está activa
  const fromContext = searchParams.get("from");
  const currentPath = pathname.replace(urlBase ?? "", "");
  const currentSegment = currentPath.split("/").filter(Boolean)[0] ?? "/";
  const effectiveSegment = fromContext || currentSegment;

  const isItemActive = (item: NavItem) => {
    const itemSegment = item.href.split("/").filter(Boolean)[0] ?? "/";
    return effectiveSegment === itemSegment || pathname.startsWith(urlBase ? `${urlBase}/${item.href}` : item.href);
  };

  const isMoreActive = moreItems.some(isItemActive);

  return {
    mainItems,
    moreItems,
    hidden,
    isMoreOpen,
    setIsMoreOpen,
    isItemActive,
    isMoreActive,
    showMoreButton,
  };
};
