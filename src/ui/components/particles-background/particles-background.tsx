"use client";

import { useEffect, useRef } from "react";

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
  // trophy
  [
    "M6 9H4.5a2.5 2.5 0 0 1 0-5H6",
    "M18 9h1.5a2.5 2.5 0 0 0 0-5H18",
    "M4 22h16",
    "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",
    "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",
    "M18 2H6v7a6 6 0 0 0 12 0V2Z",
  ],
  // target
  ["CIRCLE:12,12,10", "CIRCLE:12,12,6", "CIRCLE:12,12,2"],
  // activity / runner pulse
  [
    "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
  ],
  // medal
  [
    "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15",
    "M11 12 5.12 2.2",
    "M13 12l5.88-9.8",
    "M8 7h8",
    "CIRCLE:12,17,5",
    "M12 18v-2h-.5",
  ],
  // dumbbell
  [
    "M14.4 14.4 9.6 9.6",
    "M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767 1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l-1.768 1.767a2 2 0 1 1 2.828 2.829z",
    "m21.5 21.5-1.4-1.4",
    "M3.9 3.9 2.5 2.5",
    "M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z",
  ],
  // zap
  [
    "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  ],
];

interface Particle {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  drift: number;
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

export function ParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const COUNT = 28;
    const particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };
    const rect = () => container.getBoundingClientRect();

    for (let i = 0; i < COUNT; i++) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.willChange = "transform";
      el.style.opacity = "0.06";
      el.style.color = "var(--foreground)";
      const size = 26 + Math.random() * 42;
      el.innerHTML = buildSvg(ICON_PATHS[i % ICON_PATHS.length], size);
      container.appendChild(el);

      const r = rect();
      const baseX = Math.random() * (r.width || window.innerWidth);
      const baseY = Math.random() * (r.height || window.innerHeight * 2);
      particles.push({
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        vx: 0,
        vy: 0,
        drift: Math.random() * Math.PI * 2,
        size,
        el,
      });
    }

    const onMove = (e: MouseEvent) => {
      const r = rect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.005;
      const r = rect();
      const w = r.width || window.innerWidth;
      const h = r.height || window.innerHeight * 2;

      for (const p of particles) {
        p.baseX += Math.cos(p.drift + t) * 0.15;
        p.baseY += Math.sin(p.drift + t * 0.8) * 0.15 - 0.14;

        if (p.baseY < -60) p.baseY = h + 40;
        if (p.baseX < -60) p.baseX = w + 40;
        if (p.baseX > w + 60) p.baseX = -40;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const radius = 150;
        if (dist < radius && dist > 0.001) {
          const force = (1 - dist / radius) * 7;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.vx += (p.baseX - p.x) * 0.02;
        p.vy += (p.baseY - p.y) * 0.02;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        p.el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) rotate(${(p.x + p.y) * 0.04}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      particles.forEach((p) => p.el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    />
  );
}
