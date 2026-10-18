import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { ArrowLeft02Icon, Mortarboard02Icon, UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getMyGroups } from "@/modules/teacher/actions/get-my-groups";
import { TeacherGroupCard } from "@/modules/teacher/components/groups/TeacherGroupCard";
import { EmptyGroupsCard } from "@/modules/teacher/components/groups/EmptyGroupsCard";

export default async function TeacherGroupsPage() {
  const groupsRes = await getMyGroups();

  if (groupsRes.error || !groupsRes.data) {
    return (
      <div className="p-8 text-center border border-danger/30 rounded-2xl bg-danger/5 max-w-lg mx-auto mt-10">
        <h3 className="text-base font-bold text-danger mb-2">
          Error al cargar tus grupos
        </h3>
        <p className="text-xs text-default-600 mb-4">
          {groupsRes.message || "No se pudieron obtener los grupos asignados."}
        </p>
        <Link href="/teacher">
          <Button size="sm" variant="outline">
            Volver al inicio
          </Button>
        </Link>
      </div>
    );
  }

  const data = groupsRes.data;
  const groups = data.groups || [];
  const courseCount = groups.filter((g) => g.type === "COURSE").length;
  const teamCount = groups.filter((g) => g.type === "TEAM").length;

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-divider/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/teacher"
              className="text-default-400 hover:text-foreground transition-colors text-xs flex items-center gap-1"
            >
              <HugeiconsIcon icon={ArrowLeft02Icon} size={13} />
              <span>Inicio</span>
            </Link>
            <span className="text-default-300">/</span>
            <span className="text-xs text-primary font-medium">
              {data.isSupervisor ? "Supervisión de grupos" : "Mis grupos"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
              {data.isSupervisor ? "Todos los Grupos Activos" : "Mis Grupos Asignados"}
            </h1>
            {data.isSupervisor && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/15 text-secondary border border-secondary/30">
                Supervisión
              </span>
            )}
          </div>
          <p className="text-sm text-default-500 mt-0.5">
            {data.isSupervisor
              ? "Acceso de supervisión técnica a todos los turnos y categorías activas del club."
              : "Turnos de escuela y categorías competitivas vinculadas a tu cuenta de personal."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            {courseCount} Escuela{courseCount !== 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
            {teamCount} Equipo{teamCount !== 1 ? "s" : ""}
          </span>
        </div>
      </section>

      {/* 2. Groups Grid or Empty State */}
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((group) => (
            <TeacherGroupCard key={`${group.type}-${group.groupId}`} group={group} />
          ))}
        </div>
      ) : (
        <EmptyGroupsCard
          message="No tienes grupos asignados actualmente"
          description="Una vez que la administración vincule tu ficha de personal a un turno o categoría deportiva, podrás visualizarlos aquí."
        />
      )}
    </div>
  );
}
