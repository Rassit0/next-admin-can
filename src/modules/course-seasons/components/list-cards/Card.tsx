import {
  ICourseSeason,
  STATUS_BG_MAP,
  CourseSeasonActions,
  ManageShiftsModal,
  ViewShiftsModal,
} from "@/modules/course-seasons";
import { Avatar, Button, Card } from "@heroui/react";
import {
  Add01Icon,
  Delete01Icon,
  Money03Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import Link from "next/link";
import { STATUS_TEXT_MAP } from "../../constants/course-seasons.constants";
import { ButtonEdit } from "./ButtonEdit";
import { ButtonPlans } from "./ButtonPlans";
import { ButtonMemberships } from "./ButtonMemberships";

import { ICourseSeasonShift } from "@/modules/course-seasons/interfaces/course-season.interface";

interface Props {
  courseSeason: ICourseSeason;
  urlBase: string;
}

export const CardCourseSeason = ({ courseSeason, urlBase }: Props) => {
  if (!courseSeason) return null;

  const hasAnyOpen = courseSeason.isRegistrationOpen;

  return (
    <Card className="p-0 overflow-hidden flex flex-col shadow-sm">
      <div className="h-40 relative overflow-hidden">
        <img
          alt="Course"
          className="w-full h-full object-cover"
          src={
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBdnoetj5j2XzJ4YuyxPOW9ygEnipikr9HW2Ws685WzidbfCMuf7oyHv1dPCkWMH3GBc7oW5pjhSwp090-CscKqqUhTwS18FYDOcFyFKRT8XymaR3Sgnjc91-qHv3L2ay9hL-pmILP7EJiiQ6hhh2-LaTDArakpVrCk_-KTeU8lDCIpoxGx4573NRqqyLK_fbEAfKmG1SM8YlugZptSlVr5ImQPVoTjSSlp4vULzIsoJUcN0hPnG_hr5S4SnzZUip_3gexcwcH_rBe8"
          }
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <div
            className={`${STATUS_BG_MAP[courseSeason.status]} text-white font-label-sm px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-lg text-[10px]`}
          >
            {courseSeason.status === "ACTIVE" && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            )}
            {STATUS_TEXT_MAP[courseSeason.status]}
          </div>
          {(courseSeason.status === "ACTIVE" ||
            courseSeason.status === "DRAFT") && (
            <div
              className={`${
                hasAnyOpen ? "bg-success" : "bg-danger"
              } text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md border border-white/20`}
            >
              {hasAnyOpen ? "Inscripciones Abiertas" : "Inscripciones Cerradas"}
            </div>
          )}
        </div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <CourseSeasonActions courseSeason={courseSeason} baseUrl={urlBase} />
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-headline-sm text-primary mb-1">
          {courseSeason.course?.name || "Curso"} - {Array.from(new Set(courseSeason.shifts?.map((s) => s.category?.name).filter(Boolean))).join(' · ') || "Varias Categorías"}
        </h3>
        <p className="text-on-surface-variant text-xs mb-1 font-bold">
          {courseSeason.name}
        </p>
        <p className="text-on-surface-variant text-xs mb-4 italic opacity-80">
          {courseSeason.season?.name} • {courseSeason.shifts?.length || 0} turnos
        </p>

        <div className="mt-2">
          <div className="flex flex-col gap-2 mb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Turnos
            </h4>
            <div className="flex flex-wrap gap-2 w-full">
              <div className="flex-1 min-w-35">
                <ViewShiftsModal
                  courseSeason={courseSeason}
                  urlBase={urlBase}
                />
              </div>
              <div className="flex-1 min-w-35">
                <ManageShiftsModal courseSeason={courseSeason} urlBase={urlBase} />
              </div>
            </div>
          </div>
        </div>

        {courseSeason.status === "ACTIVE" && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <ButtonPlans courseSeasonId={courseSeason.id} urlBase={urlBase} />
          </div>
        )}
      </div>
    </Card>
  );
};
