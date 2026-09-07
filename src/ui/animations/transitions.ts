import { Variants } from "framer-motion";

// Contenedor principal que orquesta la entrada de sus hijos de forma escalonada
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

// Animación de entrada de abajo hacia arriba (rápida y sutil)
export const fadeInUp: Variants = {
  hidden: { 
    opacity: 0, 
    y: 12 
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
      mass: 0.8
    }
  },
};

// Efecto hover muy sutil para tarjetas interactivas
export const cardHover = {
  rest: { y: 0, scale: 1 },
  hover: { 
    y: -2, 
    scale: 1.005,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25 
    }
  },
};

// Transición para items de listas dinámicas (ej: cargos pagados que desaparecen)
export const listItemTransition: Variants = {
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
  show: { 
    opacity: 1, 
    height: "auto",
    overflow: "visible",
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    height: 0,
    overflow: "hidden",
    marginTop: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 0,
    transition: { opacity: { duration: 0.2 }, height: { duration: 0.3 } }
  }
};
