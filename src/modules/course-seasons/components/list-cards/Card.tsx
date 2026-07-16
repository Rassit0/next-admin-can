import { AddMembershipDrawer, ICourseSeason, STATUS_BG_MAP, CourseSeasonActions } from "@/modules/course-seasons";
import { Button, Card } from "@heroui/react";
import {
  Add01Icon,
  Delete01Icon,
  Edit02Icon,
  Money03Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";
import { STATUS_TEXT_MAP } from "../../../course-membership-offerings/constants/course-offering.constants";
import { ButtonEdit } from "./ButtonEdit";
import { ButtonPlans } from "./ButtonPlans";
import { ButtonMemberships } from "./ButtonMemberships";
import { EnrollMembershipDrawer } from "@/modules/student-memberships";
import { IPaymentPlan } from "@/modules/payment-plans";
import { IStudent } from "@/modules/students";
import { ButtonToggleBillingEngine } from "./ButtonToggleBillingEngine";

interface Props {
  courseSeason: ICourseSeason;
  urlBase: string;
}

export const CardCourseSeason = ({ courseSeason, urlBase }: Props) => {
  const ContentActive = () => {
    return (
      <>
        <div className="space-y-4 mb-8">
          <div>
            <div className="flex justify-between text-[10px] font-label-sm mb-1 uppercase text-outline">
              Ocupación del Clan
            </div>
            <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden relative">
              <div
                className={`absolute inset-y-0 left-0 shimmer-bar rounded-full w-[${(courseSeason._count.studentMemberships / courseSeason.maxMembers) * 100}%]`}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] mt-1 font-label-sm text-on-surface-variant">
              <span>Capacidad: {courseSeason.maxMembers}</span>
              <span className="text-primary font-bold">
                {courseSeason._count.studentMemberships} Atletas
              </span>
            </div>
          </div>
        </div>
        <div className="mt-auto space-y-3">
          <AddMembershipDrawer courseSeasonId={courseSeason.id} />
          {/* <EnrollMembershipDrawer courseSeason={courseSeason} size="md" /> */}

          <div className="grid grid-cols-2 gap-2">
            <ButtonMemberships courseSeasonId={courseSeason.id} urlBase={urlBase} />
            <ButtonPlans courseSeasonId={courseSeason.id} urlBase={urlBase} />
          </div>
        </div>
      </>
    );
  };

  const ContentActiveCompleted = () => {
    return (
      <>
        <div className="space-y-4 mb-8">
          <div>
            <div className="flex justify-between text-[10px] font-label-sm mb-1 uppercase text-outline">
              Ocupación del Clan
            </div>
            <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-accent rounded-full w-full"></div>
            </div>
            <div className="flex justify-between text-[10px] mt-1 font-label-sm text-error font-bold">
              <span>Capacidad: 25</span>
              <span>¡MAXIMA CAPACIDAD!</span>
            </div>
          </div>
        </div>
        <div className="mt-auto space-y-3">
          <Button className="w-full py-3.5 bg-outline-variant/40 text-on-surface-variant/50 rounded-full font-extrabold text-md cursor-not-allowed border border-outline-variant/20">
            ¡Cupos Llenos!
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" className="w-full">
              <HugeiconsIcon icon={UserGroupIcon} />
              <span className="text-xs font-bold">Miembros</span>
            </Button>
            <Button variant="secondary" className="w-full">
              <HugeiconsIcon icon={Money03Icon} />
              <span className="text-xs font-bold">Planes</span>
            </Button>
          </div>
        </div>
      </>
    );
  };

  const ContentDraft = () => {
    return (
      <>
        <div className="space-y-4 mb-8">
          <div className="p-4 bg-default rounded-full border border-outline-variant/20 border-dashed">
            <p className="text-xs text-outline text-center">
              Faltan detalles por definir para activar esta temporada.
            </p>
          </div>
        </div>
        <div className="mt-auto space-y-3">
          <ButtonEdit urlBase={urlBase} courseSeasonId={courseSeason.id} />
          <Button
            variant="danger-soft"
            className="w-full py-3.5 font-bold text-md hover:bg-error-container/20 rounded-full transition-all"
          >
            <HugeiconsIcon icon={Delete01Icon} strokeWidth={3} />
            Eliminar Borrador
          </Button>
        </div>
      </>
    );
  };

  const ContentFinished = () => {
    return (
      <>
        <div className="mt-auto space-y-3">
          <Button className="w-full py-3.5 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-lg">
              assessment
            </span>
            Ver Reporte / Estadísticas
          </Button>
          <Button className="w-full py-3.5 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-md flex items-center justify-center gap-2 hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-lg">
              visibility
            </span>
            Ver Miembros
          </Button>
        </div>
      </>
    );
  };

  return (
    <Card className="p-0 overflow-hidden card-hover flex flex-col group shadow-sm">
      <div className="h-52 relative overflow-hidden">
        <img
          alt="Hawaiian Waves"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdnoetj5j2XzJ4YuyxPOW9ygEnipikr9HW2Ws685WzidbfCMuf7oyHv1dPCkWMH3GBc7oW5pjhSwp090-CscKqqUhTwS18FYDOcFyFKRT8XymaR3Sgnjc91-qHv3L2ay9hL-pmILP7EJiiQ6hhh2-LaTDArakpVrCk_-KTeU8lDCIpoxGx4573NRqqyLK_fbEAfKmG1SM8YlugZptSlVr5ImQPVoTjSSlp4vULzIsoJUcN0hPnG_hr5S4SnzZUip_3gexcwcH_rBe8"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
          <div
            className={`${STATUS_BG_MAP[courseSeason.status]} text-white font-label-sm px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-lg`}
          >
            <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
            {STATUS_TEXT_MAP[courseSeason.status]}
          </div>
          {(courseSeason.status === "ACTIVE" || courseSeason.status === "DRAFT") && (
            <div
              className={`${
                courseSeason.isRegistrationOpen
                  ? "bg-success"
                  : "bg-danger"
              } text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md border border-white/20`}
            >
              {courseSeason.isRegistrationOpen
                ? "Inscripciones Abiertas"
                : "Inscripciones Cerradas"}
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {courseSeason.status === "ACTIVE" && courseSeason.billingConfig && (
            <ButtonToggleBillingEngine
              courseSeasonId={courseSeason.id}
              billingConfig={courseSeason.billingConfig}
            />
          )}
          <CourseSeasonActions courseSeason={courseSeason} />
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-headline-md text-primary mb-1">
          {courseSeason.category.name}
        </h3>
        <p className="text-on-surface-variant text-sm mb-6 italic opacity-80">
          {courseSeason.description}
        </p>
        {courseSeason.status === "ACTIVE" &&
          courseSeason._count.studentMemberships < courseSeason.maxMembers && (
            <ContentActive />
          )}
        {courseSeason.status === "ACTIVE" &&
          courseSeason._count.studentMemberships >= courseSeason.maxMembers && (
            <ContentActiveCompleted />
          )}
        {courseSeason.status === "DRAFT" && <ContentDraft />}
        {courseSeason.status === "FINISHED" && <ContentFinished />}
      </div>
    </Card>
  );
};
