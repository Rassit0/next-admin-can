"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PublicInstitutionHistoryResponse } from "../interfaces/history.interface";

export function Institucion({
  data,
}: {
  data: PublicInstitutionHistoryResponse;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 60%"],
  });
  const pathScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
  });

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mb-14 text-center">
        <h1 className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl">
          {data.intro.title.split(" ")[0]}{" "}
          <span className="text-neon text-glow-neon">
            {data.intro.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground text-pretty whitespace-pre-line">
          {data.intro.description}
        </p>
      </div>

      {data.intro.imageUrl && (
        <div className="mb-14 w-full flex justify-center">
          <img
            src={data.intro.imageUrl}
            alt={data.intro.imageAlt || "Institution history image"}
            className="max-w-full rounded-2xl shadow-lg border border-border"
          />
        </div>
      )}

      <div ref={containerRef} className="relative">
        {/* Track */}
        <div className="absolute left-4 top-0 h-full w-0.5 -translate-x-1/2 bg-border sm:left-1/2" />
        {/* Neon drawing path */}
        <motion.div
          style={{ scaleY: pathScale }}
          className="absolute left-4 top-0 h-full w-0.5 origin-top -translate-x-1/2 bg-neon shadow-neon sm:left-1/2"
        />

        <div className="space-y-12">
          {data.timeline.map((node: any, i: number) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={node.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className={`relative flex items-center pl-12 sm:pl-0 ${
                  left ? "sm:justify-start" : "sm:justify-end"
                }`}
              >
                {/* Node dot */}
                <span className="absolute left-4 top-6 z-10 flex h-5 w-5 -translate-x-1/2 items-center justify-center sm:left-1/2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon/40" />
                  <span className="relative h-3 w-3 rounded-full bg-neon shadow-neon" />
                </span>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="group w-full rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-neon sm:w-[44%]"
                >
                  <span className="font-heading text-3xl font-700 text-neon">
                    {node.year}
                  </span>
                  <h3 className="mt-1 font-heading text-xl font-700 uppercase tracking-wide text-primary">
                    {node.title}
                  </h3>
                  <motion.p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-muted-foreground opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                    {node.description}
                  </motion.p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground group-hover:hidden">
                    Pasi¡ el cursor para conocer mi¡s.
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
