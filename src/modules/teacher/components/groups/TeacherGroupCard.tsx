import React from "react";
import { Card } from "@heroui/react";
import {
  Mortarboard02Icon,
  UserGroupIcon,
  Time02Icon,
  UserIcon,
  ArrowRight02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { TeacherGroup } from "../../interfaces/teacher.interface";
import { formatStaffRole } from "../../utils/role-mapper";

interface TeacherGroupCardProps {
  group: TeacherGroup;
}

export const TeacherGroupCard: React.FC<TeacherGroupCardProps> = ({ group }) => {
  const isCourse = group.type === "COURSE";
  const roleLabel = formatStaffRole(group.role, group.customRole);

  return (
    <Card
      className="p-5 flex flex-col justify-between border border-divider hover:border-primary/40 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isCourse
                ? "bg-primary/10 text-primary border border-primary/20"
                : "bg-secondary/10 text-secondary border border-secondary/20"
            }`}
          >
            <HugeiconsIcon
              icon={isCourse ? Mortarboard02Icon : UserGroupIcon}
              size={14}
            />
            <span>{isCourse ? "Escuela Deportiva" : "Equipo Competitivo"}</span>
          </span>

          {group.isPrimary && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning/10 text-warning border border-warning/20">
              <HugeiconsIcon icon={StarIcon} size={13} />
              <span>Principal</span>
            </span>
          )}
        </div>

        {/* Title & Group Info */}
        <h3 className="text-lg font-bold text-foreground mb-1 leading-snug">
          {group.name}
        </h3>
        <p className="text-sm text-default-500 mb-4">{group.detail}</p>

        {/* Key Metrics / Context */}
        <div className="space-y-2 py-3 border-y border-divider/60 text-xs text-default-600">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon icon={UserIcon} size={15} className="text-default-400" />
              <span>Rol asignado:</span>
            </span>
            <span className="font-semibold text-foreground">{roleLabel}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={isCourse ? UserIcon : UserGroupIcon}
                size={15}
                className="text-default-400"
              />
              <span>{isCourse ? "Participantes vigentes:" : "Jugadores activos:"}</span>
            </span>
            <span className="font-bold text-foreground">
              {group.participantCount}
              {isCourse && group.administrativeCount > group.participantCount && (
                <span className="text-default-400 font-normal ml-1">
                  ({group.administrativeCount} inscritos)
                </span>
              )}
            </span>
          </div>

          {group.shift && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HugeiconsIcon icon={Time02Icon} size={15} className="text-default-400" />
                <span>Horario / Turno:</span>
              </span>
              <span className="font-medium text-foreground">{group.shift}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-4 pt-2 flex items-center justify-between">
        <span className="text-xs text-default-400">
          {group.category ? `Cat. ${group.category}` : "General"}
        </span>
        <Link
          href={`/teacher/groups/${group.type}/${group.groupId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          <span>Ver grupo</span>
          <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
        </Link>
      </div>
    </Card>
  );
};
