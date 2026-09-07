"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/** Minimalist sports icon path-sets (24x24 viewBox, stroked). */
const ICON_PATHS: string[][] = [
  // volleyball
  [
    "M11 7a16 16 20 0 1 10.98 4.362",
    "M12 12a13 13 0 0 1-8.66 5",
    "M16.83 13.634a16 16 0 0 1-9.267 7.328",
    "M20.66 17A13 13 0 0 0 12 12a13 13 0 0 1 0-10",
    "M8.17 15.366a16 16 0 0 1-1.713-11.69",
    "CIRCLE:12,12,10",
  ],
  // stopwatch / timer
  ["LINE:10,2,14,2", "LINE:12,14,15,11", "CIRCLE:12,14,8"],
  // target
  ["CIRCLE:12,12,10", "CIRCLE:12,12,6", "CIRCLE:12,12,2"],
  // activity / runner pulse
  [
    "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
  ],
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  el: HTMLDivElement;
}

function buildSvg(paths: string[], size: number): string {
  const inner = paths
    .map((p) => {
      if (p.startsWith("CIRCLE:")) {
        const [cx, cy, r] = p.slice(7).split(",");
        return `<circle cx="${cx}" cy="${cy}" r="${r}" />`;
      }
      if (p.startsWith("LINE:")) {
        const [x1, y1, x2, y2] = p.slice(5).split(",");
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" />`;
      }
      return `<path d="${p}" />`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

export function PersonHeroParticles() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    const COUNT = 10;
    const particles: Particle[] = [];
    const rect = () => container.getBoundingClientRect();

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.willChange = "transform";
      el.style.opacity = "0.03";
      el.style.color = "var(--foreground)";
      const size = 30 + Math.random() * 40;
      el.innerHTML = buildSvg(ICON_PATHS[i % ICON_PATHS.length], size);
      container.appendChild(el);

      const r = rect();
      const x = Math.random() * (r.width || window.innerWidth);
      const y = Math.random() * (r.height || 100);
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.2, // Very slow drift
        vy: (Math.random() - 0.5) * 0.2,
        size,
        el,
      });
    }

    let raf = 0;
    const tick = () => {
      const r = rect();
      const w = r.width || window.innerWidth;
      const h = r.height || 100;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around smoothly
        if (p.x < -60) p.x = w + 40;
        if (p.x > w + 60) p.x = -40;
        if (p.y < -60) p.y = h + 40;
        if (p.y > h + 60) p.y = -40;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${(p.x + p.y) * 0.02}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      particles.forEach((p) => p.el.remove());
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-xl"
    />
  );
}
