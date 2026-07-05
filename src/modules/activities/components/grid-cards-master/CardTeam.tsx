import React from "react";
import { IActivity } from "@/modules/activities";
import { Button, Card, Label, ProgressBar } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import { Actions } from "./Actions";
import { ProgressMembers } from "./ProgressMembers";
import { ButtonManage } from "./ButtonManage";

interface Props {
  activity: IActivity;
}
export const CardTeam = ({ activity }: Props) => {
  return (
    <Card className="p-0 max-w-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
      <Card.Header className="h-48 w-full overflow-hidden">
        <img
          alt="Sub-17 Elite Team Photo"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRNNRAJY5JICGIZ3sZjJogL-Owh7mKrRJJ0PBXnWs6OEMLB9lInEvUd6O4QCxqIupQE4NO_lraMu9ZqSE-5DlpXxvh8NWlZD6atnG5q4PY030NRrpo0nPFuj1M0D-DZ-q_PnvRD59JVmJcqL2Q3rMrpyokYa0g3sM9Y_SRPuOhO4Jf2HokNzmV0tGVBG1rwb3DuSz_MT0Jmo_1icvh2shXSkihM32hNdBpC7KTyHGtn4IxSJ4R16qvafPuh2Ess4GX2yRBNIKgbnQS"
        />
      </Card.Header>
      <Card.Content className="px-4 pb-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <Card.Title className="font-display text-xl font-bold text-on-surface">
              {activity.name}
            </Card.Title>
            <div className="flex gap-2 mt-1">
              <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-0.5 rounded-full">
                ELITE
              </span>
              <span className="bg-tertiary-container text-on-tertiary-container text-[10px] font-bold px-2 py-0.5 rounded-full">
                PUBLICADO
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-on-surface-variant">
              <HugeiconsIcon icon={Calendar04Icon} />
              <span className="text-[11px] font-medium">
                {activity.startDate === activity.endDate
                  ? activity.startDate.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : `${activity.startDate.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })} - ${activity.endDate.toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}`}
              </span>
            </div>
          </div>
          <Actions />
        </div>

        <ProgressMembers
          maxMembers={activity.maxMembers}
          minMembers={activity.minMembers}
          value={0}
        />
      </Card.Content>
      <Card.Footer className="grid grid-cols-2 gap-3 p-4 pt-0 ">
        <Button variant="secondary" className="w-full">
          Ver Inscritos
        </Button>
        <ButtonManage
          organizationId={activity.organizationId}
          activityId={activity.id}
          text="Gestionar Equipo"
        />
      </Card.Footer>
    </Card>
  );
};
