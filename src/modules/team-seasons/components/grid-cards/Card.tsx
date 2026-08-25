import React from "react";
import {
  ITeamSeason,
  STATUS_CHIP_CLASS_MAP,
  STATUS_TEXT_MAP,
  STATUS_TITLE_MAP,
  StatusTeamSeason,
} from "@/modules/team-seasons";
import { Card, Chip, Avatar } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, Money03Icon } from "@hugeicons/core-free-icons";
import { ProgressMembers } from "./ProgressMembers";
import { ButtonEdit } from "@/ui";
import { ButtonHistory } from "./ButtonHistory";
import { ButtonManageMemberships } from "./ButtonManageMemberships copy";
import { Actions } from "./Actions";
import { formatCurrency } from "../../../../utils/constants";

interface Props {
  teamSeason: ITeamSeason;
}

export const CardTeamOffering = ({ teamSeason }: Props) => {
  const statusTitleMap: Record<StatusTeamSeason, string> = {
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
            {STATUS_TITLE_MAP[teamSeason.status]}
          </span>
          <h3 className="text-2xl font-headline font-extrabold text-on-surface group-hover:text-primary transition-colors">
            {teamSeason.season.name}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Chip
            variant="primary"
            color="warning"
            className={STATUS_CHIP_CLASS_MAP[teamSeason.status]}
          >
            {teamSeason.status === "ACTIVE" && (
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
            )}
            {STATUS_TEXT_MAP[teamSeason.status]}
          </Chip>
          {teamSeason.status !== "FINISHED" &&
            teamSeason.status !== "CANCELLED" && (
              <Actions teamSeason={teamSeason} />
            )}
        </div>
      </Card.Header>
      <div className="pb-3">
        <div className="text-sm font-semibold text-primary">
          {teamSeason._count?.playerMemberships || 0} Atletas Inscritos
        </div>
      </div>
      
      {(() => {
        const primaryStaff = teamSeason.teamSeasonStaffs?.find((s) => s.isPrimary)?.staff.person || teamSeason.teamSeasonStaffs?.[0]?.staff.person;
        if (!primaryStaff) return null;
        return (
          <div className="flex items-center gap-3 mb-4 bg-surface-container-low p-2 rounded-lg border border-border/50">
            <Avatar size="sm">
              {primaryStaff.imageUrl && (
                <Avatar.Image src={primaryStaff.imageUrl} alt={`${primaryStaff.name} ${primaryStaff.lastName}`} />
              )}
              <Avatar.Fallback>{`${primaryStaff.name.charAt(0)}${primaryStaff.lastName.charAt(0)}`}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Entrenador Principal</span>
              <span className="text-xs font-semibold text-foreground">
                {primaryStaff.name} {primaryStaff.lastName}
              </span>
            </div>
          </div>
        );
      })()}

      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-center gap-3 text-sm text-on-surface-variant">
          <HugeiconsIcon icon={Calendar03Icon} className="text-accent" />
          <span>
            {teamSeason.season.startDate.toLocaleDateString("es-BO", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}{" "}
            -{" "}
            {teamSeason.season.endDate.toLocaleDateString("es-BO", {
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
        {/* {teamSeason.status === "DRAFT" && (
          <ButtonEdit
            href={`/admin/clubs/${teamSeason.team.club.id}/manage/${teamSeason.team.id}/bid-management/${teamSeason.id}/edit`}
          />
        )}
        {teamSeason.status === "ACTIVE" && (
          <ButtonManageMemberships
            href={`/admin/clubs/${teamSeason.team.club.id}/manage/${teamSeason.team.id}/bid-management/${teamSeason.id}/memberships`}
          />
        )}

        {teamSeason.status === "FINISHED" && (
          <ButtonHistory
            href={`/admin/clubs/${teamSeason.team.club.id}/manage/${teamSeason.team.id}/bid-management/${teamSeason.id}/history`}
          />
        )} */}
      </div>
    </Card>
  );
};
