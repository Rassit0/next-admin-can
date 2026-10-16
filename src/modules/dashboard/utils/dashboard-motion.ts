import { Variants } from "framer-motion";

/**
 * Super Dashboard Motion Constants & Variants (Phase E)
 *
 * Executive, subtle, fast timings:
 * - duration: 0.28s
 * - y: 8px -> 0
 * - cubic-bezier(0.25, 0.1, 0.25, 1) ease
 */
export const DASHBOARD_MOTION_EASE = [0.25, 0.1, 0.25, 1] as const;

export const dashboardSectionVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.28,
      delay: customDelay,
      ease: DASHBOARD_MOTION_EASE,
    },
  }),
};

export const dashboardReducedVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0 },
  },
};
