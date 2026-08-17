import {
  AddMembershipDrawer,
  ICourseSeason,
  STATUS_BG_MAP,
  CourseSeasonActions,
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
import { STATUS_TEXT_MAP } from "../../../course-membership-offerings/constants/course-offering.constants";
import { ButtonEdit } from "./ButtonEdit";
import { ButtonPlans } from "./ButtonPlans";
import { ButtonMemberships } from "./ButtonMemberships";

interface Props {
  courseSeasons: ICourseSeason[];
  urlBase: string;
}

export const CardCourseSeason = ({ courseSeasons, urlBase }: Props) => {
  if (!courseSeasons || courseSeasons.length === 0) return null;
  const baseSeason = courseSeasons[0]; // Used for common metadata

  const renderShift = (cs: ICourseSeason) => {
    return (
      <div key={cs.id} className="p-3 bg-surface-container-low border border-border/50 rounded-xl mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">{cs.shift?.name || "Turno"}</span>
            <div className="text-[10px] font-label-sm text-on-surface-variant bg-surface px-2 py-0.5 rounded-full border border-border/50">
              {cs._count?.studentMemberships || 0} / {cs.maxMembers}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CourseSeasonActions courseSeason={cs} baseUrl={urlBase} />
          </div>
        </div>
        
        {cs.status === "ACTIVE" && (
          <div className="flex items-center gap-2 mt-2">
            {(cs._count?.studentMemberships || 0) < cs.maxMembers ? (
              <div className="flex-1">
                <AddMembershipDrawer courseSeasonId={cs.id} />
              </div>
            ) : (
              <Button size="sm" className="flex-1 py-1 bg-outline-variant/40 text-on-surface-variant/50 rounded-full font-extrabold text-[10px] cursor-not-allowed border border-outline-variant/20">Lleno</Button>
            )}
            <ButtonMemberships courseSeasonId={cs.id} urlBase={urlBase} />
            <ButtonPlans courseSeasonId={cs.id} urlBase={urlBase} />
          </div>
        )}
        {cs.status === "DRAFT" && (
          <div className="flex items-center gap-2 mt-2">
            <ButtonEdit urlBase={urlBase} courseSeasonId={cs.id} />
            <Button
              variant="danger-soft"
              size="sm"
              className="w-full font-bold text-xs hover:bg-error-container/20 rounded-full transition-all"
            >
              <HugeiconsIcon icon={Delete01Icon} strokeWidth={3} size={16} />
              Eliminar
            </Button>
          </div>
        )}
        {cs.status === "FINISHED" && (
          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" className="flex-1 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-xs">
              Estadísticas
            </Button>
            <ButtonMemberships courseSeasonId={cs.id} urlBase={urlBase} />
          </div>
        )}
      </div>
    );
  };

  const hasAnyOpen = courseSeasons.some((cs) => cs.isRegistrationOpen);

  return (
    <Card className="p-0 overflow-hidden flex flex-col shadow-sm">
      <div className="h-40 relative overflow-hidden">
        <img
          alt="Course"
          className="w-full h-full object-cover"
          src={"https://lh3.googleusercontent.com/aida-public/AB6AXuBdnoetj5j2XzJ4YuyxPOW9ygEnipikr9HW2Ws685WzidbfCMuf7oyHv1dPCkWMH3GBc7oW5pjhSwp090-CscKqqUhTwS18FYDOcFyFKRT8XymaR3Sgnjc91-qHv3L2ay9hL-pmILP7EJiiQ6hhh2-LaTDArakpVrCk_-KTeU8lDCIpoxGx4573NRqqyLK_fbEAfKmG1SM8YlugZptSlVr5ImQPVoTjSSlp4vULzIsoJUcN0hPnG_hr5S4SnzZUip_3gexcwcH_rBe8"}
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
          <div
            className={`${STATUS_BG_MAP[baseSeason.status]} text-white font-label-sm px-3 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-lg text-[10px]`}
          >
            {baseSeason.status === "ACTIVE" && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
            {STATUS_TEXT_MAP[baseSeason.status]}
          </div>
          {(baseSeason.status === "ACTIVE" || baseSeason.status === "DRAFT") && (
            <div
              className={`${
                hasAnyOpen ? "bg-success" : "bg-danger"
              } text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase shadow-md border border-white/20`}
            >
              {hasAnyOpen
                ? "Inscripciones Abiertas"
                : "Inscripciones Cerradas"}
            </div>
          )}
        </div>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-headline-sm text-primary mb-1">
          {baseSeason.course?.name || "Curso"} - {baseSeason.category?.name}
        </h3>
        <p className="text-on-surface-variant text-xs mb-4 italic opacity-80">
          {baseSeason.season?.name} • {baseSeason.gender}
        </p>
        
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Turnos Disponibles</h4>
            <Link href={`${urlBase}/add?cloneFromId=${baseSeason.id}`}>
              <Button
                size="sm"
                variant="secondary"
                className="font-bold text-xs"
              >
                <HugeiconsIcon icon={Add01Icon} size={14} />
                Agregar Turno
              </Button>
            </Link>
          </div>
          <div className="flex flex-col">
            {courseSeasons.map(renderShift)}
          </div>
        </div>
      </div>
    </Card>
  );
};
