"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, DollarSign, Award } from "lucide-react";
import { ContactSecretaryModal } from "@/modules/portal/shared/components/contact-secretary-modal";
import { Magnetic } from "@/modules/portal/shared/components/magnetic";
import { TiltCard } from "@/modules/portal/shared/components/tilt-card";
import { findCourseBySlug } from "@/modules/portal/core/constants/data";
import { cn } from "@/lib/utils";

interface CourseDetailClientProps {
  course: Awaited<ReturnType<typeof findCourseBySlug>>;
}

export function CourseDetailClient({ course }: CourseDetailClientProps) {
  const [contactOpen, setContactOpen] = useState(false);

  if (!course) return null;

  const ageRange = `${course.minAge} - ${course.maxAge} años`;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/escuelas"
        className="mb-8 inline-flex items-center gap-2 text-neon transition-colors hover:text-neon/80"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Escuelas
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="inline-block rounded-full bg-neon/10 px-3 py-1 font-mono text-xs font-600 text-neon uppercase">
                {course.discipline}
              </span>
              <span className="inline-block rounded-full bg-silver-deep px-3 py-1 font-mono text-xs font-600 text-primary uppercase">
                {ageRange}
              </span>
            </div>

            <h1 className="font-oswald text-5xl font-bold text-primary leading-tight">
              {course.name}
            </h1>

            <p className="text-lg text-primary/70">{course.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-silver-deep bg-white p-4">
              <Clock className="mb-2 h-5 w-5 text-neon" />
              <p className="text-xs font-600 text-primary/60 uppercase">
                Frecuencia
              </p>
              <p className="font-oswald text-sm font-bold text-primary">
                {course.frequencyPerWeek}x/semana
              </p>
            </div>

            <div className="rounded-lg border border-silver-deep bg-white p-4">
              <Users className="mb-2 h-5 w-5 text-neon" />
              <p className="text-xs font-600 text-primary/60 uppercase">
                Capacidad
              </p>
              <p className="font-oswald text-sm font-bold text-primary">
                {course.capacity} Cupos
              </p>
            </div>

            <div className="rounded-lg border border-silver-deep bg-white p-4">
              <DollarSign className="mb-2 h-5 w-5 text-neon" />
              <p className="text-xs font-600 text-primary/60 uppercase">
                Matrí­cula
              </p>
              <p className="font-oswald text-sm font-bold text-primary">
                ${course.registrationFee}
              </p>
            </div>

            <div className="rounded-lg border border-silver-deep bg-white p-4">
              <Award className="mb-2 h-5 w-5 text-neon" />
              <p className="text-xs font-600 text-primary/60 uppercase">
                Mensual
              </p>
              <p className="font-oswald text-sm font-bold text-primary">
                ${course.monthlyFee}
              </p>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <h2 className="font-oswald text-2xl font-bold text-primary">
              Horarios
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {course.weeklySchedule?.map((schedule: string, idx: number) => (
                <div
                  key={idx}
                  className="rounded-lg border border-neon/20 bg-neon/5 px-4 py-3 font-mono text-sm text-primary"
                >
                  {schedule}
                </div>
              ))}
            </div>
          </div>

          {/* Professors */}
          <div className="space-y-4">
            <h2 className="font-oswald text-2xl font-bold text-primary">
              Profesores
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {course.professors?.map((prof: any) => (
                <div
                  key={prof.id}
                  className="rounded-lg border border-silver-deep bg-white p-4"
                >
                  <p className="font-oswald text-sm font-bold text-primary">
                    {prof.name}
                  </p>
                  <p className="text-xs text-primary/60">{prof.specialty}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Requirements */}
          {course.requirements && course.requirements.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-oswald text-2xl font-bold text-primary">
                Requisitos
              </h2>
              <ul className="space-y-2">
                {course.requirements.map((req: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-primary/80"
                  >
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-neon/20 text-neon">
                      ✓
                    </span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Sidebar CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-1"
        >
          <TiltCard className="sticky top-40 space-y-6 rounded-xl border border-neon/20 bg-linear-to-br from-silver-deep to-white p-6 shadow-lg">
            <div>
              <p className="text-xs font-600 text-primary/60 uppercase">
                Precio Total
              </p>
              <p className="font-oswald text-3xl font-bold text-neon">
                ${course.monthlyFee}
                <span className="text-xs font-500 text-primary/60">/mes</span>
              </p>
              <p className="mt-1 text-xs text-primary/50">
                + ${course.registrationFee} de matrí­cula inicial
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-600 text-primary/60 uppercase">
                Disponibilidad
              </p>
              <div className="flex h-2 overflow-hidden rounded-full bg-silver-deep">
                <div
                  className="bg-neon transition-all duration-300"
                  style={{
                    width: `${(course.enrolled / course.capacity) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm font-600 text-primary">
                {course.capacity - course.enrolled} cupos disponibles
              </p>
            </div>

            <Magnetic>
              <button
                onClick={() => setContactOpen(true)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-lg",
                  "bg-neon px-4 py-4 font-bold text-white",
                  "transition-all duration-300",
                  "before:absolute before:inset-0 before:bg-linear-to-r before:from-neon/0 before:via-white/20 before:to-neon/0",
                  "before:-translate-x-full before:transition-transform before:duration-500",
                  "hover:before:translate-x-full",
                  "shadow-lg shadow-neon/50",
                )}
              >
                Consultar Cupos
              </button>
            </Magnetic>

            <p className="text-xs text-center text-primary/50">
              Contacta con nuestra secretarí­a para inscribirte
            </p>
          </TiltCard>
        </motion.div>
      </div>

      {/* Contact Modal */}
      <ContactSecretaryModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        title="Consultar Disponibilidad"
        message={`Te ayudaremos con la inscripción al curso de ${course.name}. Contáctanos para conocer los detalles y disponibilidad.`}
      />
    </div>
  );
}
