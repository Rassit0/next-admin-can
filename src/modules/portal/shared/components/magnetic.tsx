"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "button" | "div";
  onClick?: () => void;
}

export function Magnetic({
  children,
  className,
  strength = 0.4,
  as = "button",
  onClick,
}: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 250, damping: 15 });
  const sy = useSpring(y, { stiffness: 250, damping: 15 });

  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();

    const currentX = x.get();
    const currentY = y.get();

    const centerX = r.left - currentX + r.width / 2;
    const centerY = r.top - currentY + r.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  }
  function leave() {
    x.set(0);
    y.set(0);
  }

  const Component = as === "div" ? motion.div : motion.button;

  return (
    <Component
      ref={ref as any}
      type={as === "button" ? "button" : undefined}
      onClick={onClick}
      onMouseMove={move}
      onMouseLeave={leave}
      style={{ x: sx, y: sy }}
      className={cn("relative", className)}
    >
      {children}
    </Component>
  );
}
