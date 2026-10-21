"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Spinner } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar01Icon,
  CalendarAdd01Icon,
  Mortarboard02Icon,
  UserGroupIcon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { SessionFormModal } from "@/modules/calendar";
import { getCourseSeasonById } from "@/modules/course-seasons/actions/get-by-id";
import { getTeamSeasonById } from "@/modules/team-seasons/actions/get-by-id";

interface ScheduleClientPageProps {
  teamSeasonId?: string;
  courseSeasonId?: string;
}

interface OperationalGroup {
  id: string;
  name: string;
  subtitle?: string;
}

interface SeasonData {
  title: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  groups: OperationalGroup[];
}

export const ScheduleClientPage = ({
  teamSeasonId,
  courseSeasonId,
}: ScheduleClientPageProps) => {
  const [loading, setLoading] = useState(true);
  const [seasonData, setSeasonData] = useState<SeasonData | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<OperationalGroup | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadData = async () => {
      try {
        if (courseSeasonId) {
          const res = await getCourseSeasonById({ id: courseSeasonId });
          if (!isMounted) return;

          if (res.error || !res.data) {
            toast.error(res.message || "No se pudo cargar la temporada del curso");
            return;
          }

          const cs = res.data;
          const groups: OperationalGroup[] = (cs.shifts || []).map((s) => ({
            id: s.id,
            name: s.shift?.name || "Turno",
            subtitle: `${s.category?.name ? `${s.category.name} · ` : ""}${s.gender || "MIXTO"}`,
          }));

          setSeasonData({
            title: cs.course?.name || cs.name,
            seasonName: cs.season?.name || "Temporada",
            startDate:
              typeof cs.season?.startDate === "string"
                ? cs.season.startDate
                : cs.season?.startDate?.toISOString?.() || "",
            endDate:
              typeof cs.season?.endDate === "string"
                ? cs.season.endDate
                : cs.season?.endDate?.toISOString?.() || "",
            groups,
          });
        } else if (teamSeasonId) {
          const res = await getTeamSeasonById({ id: teamSeasonId });
          if (!isMounted) return;

          if (res.error || !res.data) {
            toast.error(res.message || "No se pudo cargar la temporada del equipo");
            return;
          }

          const ts = res.data;
          const groups: OperationalGroup[] = (ts.categories || []).map((c) => ({
            id: c.id,
            name: c.category?.name || "Categoría",
            subtitle: `Rama: ${c.gender || "GENERAL"}`,
          }));

          setSeasonData({
            title: ts.team?.name || "Equipo",
            seasonName: ts.season?.name || "Temporada",
            startDate:
              typeof ts.season?.startDate === "string"
                ? ts.season.startDate
                : ts.season?.startDate?.toISOString?.() || "",
            endDate:
              typeof ts.season?.endDate === "string"
                ? ts.season.endDate
                : ts.season?.endDate?.toISOString?.() || "",
            groups,
          });
        }
      } catch (err: any) {
        if (isMounted) {
          toast.error(err.message || "Error al cargar la información del grupo");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [courseSeasonId, teamSeasonId]);

  const handleOpenScheduleForGroup = (group: OperationalGroup) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const handleOpenDefaultSchedule = () => {
    if (!seasonData || seasonData.groups.length === 0) {
      toast.warning("No hay turnos ni categorías configuradas en esta temporada.");
      return;
    }
    setSelectedGroup(seasonData.groups[0]);
    setIsModalOpen(true);
  };

  const formatDateDisplay = (isoStr?: string) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      return new Intl.DateTimeFormat("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    } catch {
      return isoStr.split("T")[0] || isoStr;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-default-400 font-medium">
          Cargando configuración de horarios...
        </span>
      </div>
    );
  }

  const isCourse = Boolean(courseSeasonId);

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-content1 border border-divider p-6 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-primary">
              {isCourse ? "Escuela Deportiva" : "Club / Equipo"}
            </span>
            <span className="text-default-300">•</span>
            <span className="text-xs text-default-400 font-medium">
              {seasonData?.seasonName}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {seasonData?.title || "Programación de Sesiones y Horarios"}
          </h2>
          {seasonData?.startDate && seasonData?.endDate && (
            <p className="text-xs text-default-500">
              Vigencia de temporada: {formatDateDisplay(seasonData.startDate)} —{" "}
              {formatDateDisplay(seasonData.endDate)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/calendar">
            <Button variant="ghost" size="sm" className="font-semibold text-xs">
              <HugeiconsIcon icon={Calendar01Icon} size={15} />
              <span>Ver Calendario</span>
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            className="font-semibold text-xs"
            onPress={handleOpenDefaultSchedule}
            isDisabled={!seasonData || seasonData.groups.length === 0}
          >
            <HugeiconsIcon icon={CalendarAdd01Icon} size={15} />
            <span>Programar Sesión</span>
          </Button>
        </div>
      </div>

      {/* 2. Target Operational Groups Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-default-500">
            {isCourse
              ? `Turnos Disponibles (${seasonData?.groups.length || 0})`
              : `Categorías Disponibles (${seasonData?.groups.length || 0})`}
          </span>
          <span className="text-xs text-default-400">
            Cada sesión se asocia exactamente a un turno o categoría
          </span>
        </div>

        {(!seasonData?.groups || seasonData.groups.length === 0) && (
          <Card className="p-8 text-center border border-dashed border-divider bg-content1/50">
            <p className="text-sm text-default-500">
              No hay {isCourse ? "turnos" : "categorías"} configurados para esta
              temporada.
            </p>
            <p className="text-xs text-default-400 mt-1">
              Configure al menos un {isCourse ? "turno" : "categoría"} en la pestaña
              correspondiente para habilitar la programación de sesiones.
            </p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonData?.groups.map((group) => (
            <Card
              key={group.id}
              className="p-5 border border-divider bg-content1 hover:border-primary/50 transition-all flex flex-col justify-between gap-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
                  <HugeiconsIcon
                    icon={isCourse ? Mortarboard02Icon : UserGroupIcon}
                    size={20}
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-sm text-foreground">
                    {group.name}
                  </h4>
                  {group.subtitle && (
                    <p className="text-xs text-default-400 font-medium">
                      {group.subtitle}
                    </p>
                  )}
                  <span className="text-[10px] text-default-400 block font-mono">
                    ID: {group.id.slice(0, 8)}...
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-divider flex items-center justify-between">
                <span className="text-xs text-default-400">
                  Individual o Recurrente
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  className="text-xs font-semibold"
                  onPress={() => handleOpenScheduleForGroup(group)}
                >
                  <HugeiconsIcon icon={CalendarAdd01Icon} size={14} />
                  <span>Programar</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* 3. Unified Session Form Modal with Group Context */}
      {selectedGroup && (
        <SessionFormModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedGroup(null);
          }}
          mode="create"
          presetGroup={{
            type: isCourse ? "COURSE" : "TEAM",
            groupId: selectedGroup.id,
            groupName: `${seasonData?.title || ""}: ${selectedGroup.name}`,
            seasonEndDate: seasonData?.endDate,
            isTeacherContext: false,
          }}
          onSuccess={() => {
            toast.success("Sesión programada exitosamente en el calendario");
          }}
        />
      )}
    </div>
  );
};
