"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  dashboardSectionVariants,
  dashboardReducedVariants,
} from "../utils/dashboard-motion";

interface DashboardMotionSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

/**
 * DashboardMotionSection (Client Island)
 *
 * Minimal presentation boundary that receives server-rendered children
 * and applies a subtle staggered entrance without compromising SSR-first architecture.
 *
 * Fully respects prefers-reduced-motion and includes noscript fallback for JS-disabled clients.
 */
export const DashboardMotionSection: React.FC<DashboardMotionSectionProps> = ({
  children,
  delay = 0,
  className,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      data-motion-section=""
      variants={
        shouldReduceMotion
          ? dashboardReducedVariants
          : dashboardSectionVariants
      }
      initial={false}
      animate="visible"
      custom={delay}
      className={className}
    >
      {children}
    </motion.div>
  );
};
