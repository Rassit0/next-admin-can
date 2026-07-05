import {
  AddMembershipDrawer,
  ITeamSeason,
  STATUS_BG_MAP,
} from "@/modules/team-seasons";
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
import { STATUS_TEXT_MAP } from "../../../team-membership-offerings/constants/team-offering.constants";
import { ButtonEdit } from "./ButtonEdit";
import { ButtonPlans } from "./ButtonPlans";
import { ButtonMemberships } from "./ButtonMemberships";
import { EnrollMembershipDrawer } from "@/modules/player-memberships";
import { IPaymentPlan } from "@/modules/payment-plans";
import { IPlayer } from "@/modules/players";

interface Props {
  teamSeason: ITeamSeason;
  urlBase: string;
}

export const CardTeamSeason = ({ teamSeason, urlBase }: Props) => {
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
                className={`absolute inset-y-0 left-0 shimmer-bar rounded-full w-[${(teamSeason._count.playerMemberships / teamSeason.maxMembers) * 100}%]`}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] mt-1 font-label-sm text-on-surface-variant">
              <span>Capacidad: {teamSeason.maxMembers}</span>
              <span className="text-primary font-bold">
                {teamSeason._count.playerMemberships} Atletas
              </span>
            </div>
          </div>
        </div>
        <div className="mt-auto space-y-3">
          <AddMembershipDrawer teamSeasonId={teamSeason.id} />
          {/* <EnrollMembershipDrawer teamSeason={teamSeason} size="md" /> */}

          <div className="grid grid-cols-2 gap-2">
            <ButtonMemberships teamSeasonId={teamSeason.id} urlBase={urlBase} />
            <ButtonPlans teamSeasonId={teamSeason.id} urlBase={urlBase} />
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
          <ButtonEdit urlBase={urlBase} teamSeasonId={teamSeason.id} />
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
        <div
          className={`absolute top-4 right-4 ${STATUS_BG_MAP[teamSeason.status]} text-white font-label-sm px-4 py-1.5 rounded-full uppercase flex items-center gap-1.5 shadow-lg`}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
          {STATUS_TEXT_MAP[teamSeason.status]}
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="font-display font-bold text-headline-md text-primary mb-1">
          {teamSeason.category.name}
        </h3>
        <p className="text-on-surface-variant text-sm mb-6 italic opacity-80">
          {teamSeason.description}
        </p>
        {teamSeason.status === "ACTIVE" &&
          teamSeason._count.playerMemberships < teamSeason.maxMembers && (
            <ContentActive />
          )}
        {teamSeason.status === "ACTIVE" &&
          teamSeason._count.playerMemberships >= teamSeason.maxMembers && (
            <ContentActiveCompleted />
          )}
        {teamSeason.status === "DRAFT" && <ContentDraft />}
        {teamSeason.status === "FINISHED" && <ContentFinished />}
      </div>
    </Card>
  );
};
