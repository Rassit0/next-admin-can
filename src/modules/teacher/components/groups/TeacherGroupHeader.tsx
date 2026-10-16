import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import {
  ArrowLeft02Icon,
  Mortarboard02Icon,
  UserGroupIcon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TeacherGroupContext } from "../../interfaces/teacher.interface";
import { formatStaffRole } from "../../utils/role-mapper";
import { formatGroupType } from "../../utils/group-type-mapper";

interface TeacherGroupHeaderProps {
  group: TeacherGroupContext;
}

export const TeacherGroupHeader: React.FC<TeacherGroupHeaderProps> = ({
  group,
}) => {
  const isCourse = group.type === "COURSE";
  const roleLabel = formatStaffRole(group.role, group.customRole);
  const typeLabel = formatGroupType(group.type);

  return (
    <div className="space-y-4 pb-4 border-b border-divider/60">
      {/* 1. Breadcrumb & Back Link */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link
            href="/teacher/groups"
            className="text-default-400 hover:text-foreground transition-colors flex items-center gap-1 font-medium"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
            <span>Mis grupos</span>
          </Link>
          <span className="text-default-300">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-md">
            {group.name}
          </span>
        </div>

        <Link href="/teacher/groups">
          <Button
            size="sm"
            variant="outline"
            className="text-xs font-medium flex items-center gap-1.5"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={14} />
            <span className="hidden sm:inline">Volver a Mis grupos</span>
            <span className="sm:hidden">Volver</span>
          </Button>
        </Link>
      </div>

      {/* 2. Group Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
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
              <span>{typeLabel}</span>
            </span>

            {group.isPrimary && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-warning/10 text-warning border border-warning/20">
                <HugeiconsIcon icon={StarIcon} size={13} />
                <span>Principal</span>
              </span>
            )}

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-default-100 text-default-600 border border-divider">
              Cat. {group.category}
            </span>

            {group.shift && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-default-100 text-default-600 border border-divider">
                {group.shift}
              </span>
            )}

            {group.gender && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-default-100 text-default-600 border border-divider">
                {group.gender}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {group.name}
          </h1>
          <p className="text-sm text-default-500 mt-0.5">{group.detail}</p>
        </div>

        {/* Assigned Staff Role Context Box */}
        <div className="shrink-0 flex items-center gap-3 p-3 rounded-2xl bg-content1 border border-divider shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <HugeiconsIcon icon={UserIcon} size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-default-400 block">
              Tu rol docente
            </span>
            <span className="text-xs font-bold text-foreground">
              {roleLabel}
            </span>
            <span className="text-[11px] text-default-500 block">
              {group.participantCount} participantes activos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
