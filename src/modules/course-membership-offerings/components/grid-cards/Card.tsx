import React from "react";
import {
  ICourseSeason,
  STATUS_CHIP_CLASS_MAP,
  STATUS_TEXT_MAP,
  STATUS_TITLE_MAP,
  StatusCourseSeason,
} from "@/modules/course-membership-offerings";
import { Card, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Money03Icon } from "@hugeicons/core-free-icons";
import { ProgressMembers } from "./ProgressMembers";
import { ButtonEdit } from "@/ui";
import { ButtonHistory } from "./ButtonHistory";
import { ButtonManageMemberships } from "./ButtonManageMemberships copy";
import { Actions } from "./Actions";
import { formatCurrency } from "../../../../utils/constants";

interface Props {
  courseSeason: ICourseSeason;
}

export const CardCourseOffering = ({ courseSeason }: Props) => {
  const statusTitleMap: Record<StatusCourseSeason, string> = {
    ACTIVE: "Ciclo Activo",
    DRAFT: "Próximo Lanzamiento",
    FINISHED: "Ciclo Finalizado",
    CANCELLED: "Ciclo Cancelado",
  };

  return (
    <Card className="p-6 shadow-sm group hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col">
      <Card.Header className="flex flex-row justify-between items-start mb-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">
            {STATUS_TITLE_MAP[courseSeason.status]}
          </span>
          <h3 className="text-2xl font-headline font-extrabold text-on-surface group-hover:text-primary transition-colors">
            {courseSeason.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            variant="primary"
            color="warning"
            className={STATUS_CHIP_CLASS_MAP[courseSeason.status]}
          >
            {courseSeason.status === "ACTIVE" && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            )}
            {STATUS_TEXT_MAP[courseSeason.status]}
          </Chip>
          {courseSeason.status !== "FINISHED" &&
            courseSeason.status !== "CANCELLED" && (
              <Actions courseSeason={courseSeason} />
            )}
        </div>
      </Card.Header>
      <div className="pb-3">
        <ProgressMembers
          maxMembers={courseSeason.maxMembers}
          minMembers={courseSeason.minMembers}
          value={0}
          label="Cupos Ocupados"
        />
      </div>
      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <HugeiconsIcon icon={Calendar03Icon} className="text-accent" />
          <span>
            {courseSeason.startDate.toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            -{" "}
            {courseSeason.endDate.toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <HugeiconsIcon icon={Money03Icon} className="text-accent" />
          <span className="font-medium">{formatCurrency(0)}</span>
        </div>
      </div>
      <div className="flex gap-2 justify-between">
        {courseSeason.status === "DRAFT" && (
          <ButtonEdit
            href={`/admin/schools/${courseSeason.course.school.id}/manage/${courseSeason.course.id}/bid-management/${courseSeason.id}/edit`}
          />
        )}
        {courseSeason.status === "ACTIVE" && (
          <ButtonManageMemberships
            href={`/admin/schools/${courseSeason.course.school.id}/manage/${courseSeason.course.id}/bid-management/${courseSeason.id}/memberships`}
          />
        )}

        {courseSeason.status === "FINISHED" && (
          <ButtonHistory
            href={`/admin/schools/${courseSeason.course.school.id}/manage/${courseSeason.course.id}/bid-management/${courseSeason.id}/history`}
          />
        )}
      </div>
    </Card>
  );
};
