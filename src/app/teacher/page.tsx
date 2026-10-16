import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowRight02Icon, Mortarboard02Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTeacherDashboard } from "@/modules/teacher/actions/get-teacher-dashboard";
import { TeacherKpis } from "@/modules/teacher/components/dashboard/TeacherKpis";
import { TeacherUpcomingSessions } from "@/modules/teacher/components/dashboard/TeacherUpcomingSessions";
import { TeacherGroupCard } from "@/modules/teacher/components/groups/TeacherGroupCard";
import { EmptyGroupsCard } from "@/modules/teacher/components/groups/EmptyGroupsCard";

export default async function TeacherDashboardPage() {
  const dashboardRes = await getTeacherDashboard();

  if (dashboardRes.error || !dashboardRes.data) {
    return (
      <div className="p-8 text-center border border-danger/30 rounded-2xl bg-danger/5 max-w-lg mx-auto mt-10">
        <h3 className="text-base font-bold text-danger mb-2">
          Error al cargar el portal
        </h3>
        <p className="text-xs text-default-600 mb-4">
          {dashboardRes.message ||
            "No se pudo cargar la información operativa del profesor."}
        </p>
        <Link href="/admin">
          <Button size="sm" variant="outline">
            Volver al Launcher
          </Button>
        </Link>
      </div>
    );
  }

  const data = dashboardRes.data;
  const personName = data.person.name || "Profesor";
  const hasGroups = data.groups && data.groups.length > 0;

  return (
    <div className="space-y-6">
      {/* 1. Header / Saludo Personal */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider/60">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Hola, {personName} 👋
          </h1>
          <p className="text-sm text-default-500 mt-0.5">
            Esta es tu actividad docente y técnica actual en el club.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/teacher/groups">
            <Button
              size="sm"
              variant="primary"
              className="flex items-center gap-1.5"
            >
              <span>Mis Grupos ({data.stats.activeGroups})</span>
              <HugeiconsIcon icon={ArrowRight02Icon} size={15} />
            </Button>
          </Link>
        </div>
      </section>

      {/* 2. KPIs Operativos (adaptativos por permisos) */}
      <section>
        <TeacherKpis stats={data.stats} />
      </section>

      {/* 3. Panel Operativo: Mis Grupos (col-span-2) + Próximas Sesiones (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Columna Izquierda: Mis Grupos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Mortarboard02Icon} size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-foreground">
                Mis Grupos Asignados
              </h2>
            </div>
            {hasGroups && (
              <Link
                href="/teacher/groups"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <span>Ver todos</span>
                <HugeiconsIcon icon={ArrowRight02Icon} size={13} />
              </Link>
            )}
          </div>

          {hasGroups ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.groups.map((group) => (
                <TeacherGroupCard key={`${group.type}-${group.groupId}`} group={group} />
              ))}
            </div>
          ) : (
            <EmptyGroupsCard />
          )}
        </div>

        {/* Columna Derecha: Próximas Sesiones */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={Calendar01Icon} size={20} className="text-secondary" />
              <h2 className="text-lg font-bold text-foreground">
                Próxima Sesión
              </h2>
            </div>
          </div>

          <TeacherUpcomingSessions sessions={data.upcomingSessions} />
        </div>
      </div>
    </div>
  );
}
