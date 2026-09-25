"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, GraduationCap, Search, UserCircle2 } from "lucide-react";
import { TiltCard } from "@/modules/portal/shared/components/tilt-card";
import { cn } from "@/lib/utils";
import { PublicCourse } from "@/modules/portal/schools/actions/schools.action";

export function Escuelas({
  initialCourses,
}: {
  initialCourses: PublicCourse[];
}) {
  const [courses, setCourses] = useState<PublicCourse[]>(initialCourses);
  const [age, setAge] = useState<string>("");

  const parsedAge = age === "" ? null : Number(age);

  const filtered = useMemo(() => {
    if (parsedAge === null || Number.isNaN(parsedAge)) return courses;
    return courses.filter(
      (c) => parsedAge >= c.minAge && parsedAge <= c.maxAge,
    );
  }, [courses, parsedAge]);

  function enroll(id: string) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id && c.enrolled < c.capacity
          ? { ...c, enrolled: c.enrolled + 1 }
          : c,
      ),
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-36">
      <div className="mb-8">
        <h1 className="font-heading text-5xl font-700 uppercase tracking-tight text-primary sm:text-6xl">
          Escuelas de{" "}
          <span className="text-neon text-glow-neon">Formacón</span>
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground text-pretty">
          Ingresá la edad del deportista y encontraremos al instante los cursos
          que mejor se ajustan a su etapa.
        </p>
      </div>

      {/* Age filter */}
      <div className="mb-10 max-w-md">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-600 uppercase tracking-[0.18em] text-muted-foreground">
            Buscar por edad exacta
          </span>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neon" />
            <input
              type="number"
              min={3}
              max={99}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Ej. 8 años"
              className="w-full rounded-full border border-border bg-background py-3.5 pl-12 pr-4 text-sm font-500 text-primary outline-none transition-all focus:border-neon focus:shadow-neon-soft focus:ring-2 focus:ring-neon/30"
            />
          </div>
        </label>
        {parsedAge !== null && (
          <p className="mt-2 text-sm text-muted-foreground">
            {filtered.length} curso{filtered.length === 1 ? "" : "s"} para{" "}
            <span className="font-600 text-neon">{parsedAge} años</span>.
          </p>
        )}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((course) => {
            const slotsLeft = course.capacity - course.enrolled;
            const pct = (course.enrolled / course.capacity) * 100;
            const full = slotsLeft <= 0;
            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              >
                <TiltCard
                  intensity={8}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-neon"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neon/10 px-3 py-1 text-xs font-600 uppercase tracking-wide text-neon">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {course.discipline}
                    </span>
                    <span className="text-xs font-600 uppercase tracking-wide text-muted-foreground">
                      {course.minAge}–{course.maxAge} años
                    </span>
                  </div>

                  <h3 className="mt-4 font-heading text-xl font-700 uppercase leading-tight tracking-tight text-primary text-balance">
                    {course.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-neon" />
                      {course.schedule}
                    </p>
                    <p className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-neon" />
                      {course.professor}
                    </p>
                  </div>

                  {/* Capacity bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs font-600 uppercase tracking-wide">
                      <span className="text-muted-foreground">Cupos</span>
                      <motion.span
                        key={course.enrolled}
                        initial={{ scale: 1.4, color: "var(--neon)" }}
                        animate={{ scale: 1, color: "var(--primary)" }}
                        className="text-primary"
                      >
                        {course.enrolled}/{course.capacity}
                      </motion.span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className={cn(
                          "h-full rounded-full",
                          full ? "bg-primary" : "bg-neon shadow-neon",
                        )}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 26,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-heading text-lg font-700 text-primary">
                      ${course.monthlyFee}
                      <span className="text-xs font-500 text-muted-foreground">
                        {" "}
                        USD/mes
                      </span>
                    </span>
                    <button
                      onClick={() => enroll(course.id)}
                      disabled={full}
                      className={cn(
                        "rounded-full px-5 py-2.5 text-sm font-700 uppercase tracking-wide transition-all",
                        full
                          ? "cursor-not-allowed bg-secondary text-muted-foreground"
                          : "bg-primary text-white hover:bg-neon hover:shadow-neon",
                      )}
                    >
                      {full ? "Completo" : "Inscribirse"}
                    </button>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">
          No encontramos cursos para esa edad. Probá con otra.
        </p>
      )}
    </div>
  );
}
