"use client";

import {
  Button,
  Modal,
  useOverlayState,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Time02Icon, Delete01Icon } from "@hugeicons/core-free-icons";
import React from "react";
import { ICourseSeason, ICourseSeasonShift } from "@/modules/course-seasons";
import { ButtonMemberships } from "../list-cards/ButtonMemberships";
import { ButtonEdit } from "../list-cards/ButtonEdit";
import { EditShiftModal } from "./EditShiftModal";

interface Props {
  courseSeason: ICourseSeason;
  urlBase: string;
}

export const ViewShiftsModal = ({ courseSeason, urlBase }: Props) => {
  const state = useOverlayState();

  const renderShift = (shiftItem: ICourseSeasonShift) => {
    return (
      <div key={shiftItem.id} className="p-3 bg-surface-container-low border border-border/50 rounded-xl mb-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground">{shiftItem.shift?.name || "Turno"}</span>
            <div className="text-[10px] font-label-sm text-on-surface-variant bg-surface px-2 py-0.5 rounded-full border border-border/50">
              {shiftItem._count?.studentMemberships || 0} / {shiftItem.maxMembers}
            </div>
          </div>
          <EditShiftModal courseSeasonId={courseSeason.id} urlBase={urlBase} shift={shiftItem} />
        </div>
        
        {courseSeason.status === "ACTIVE" && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1">
              <ButtonMemberships courseSeasonId={courseSeason.id} shiftId={shiftItem.id} urlBase={urlBase} />
            </div>
          </div>
        )}
        {courseSeason.status === "DRAFT" && (
          <div className="flex items-center gap-2 mt-2">
            <ButtonEdit urlBase={urlBase} courseSeasonId={courseSeason.id} />
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
        {courseSeason.status === "FINISHED" && (
          <div className="flex items-center gap-2 mt-2">
            <Button size="sm" className="flex-1 bg-surface-container-highest text-on-surface-variant rounded-full font-bold text-xs">
              Estadísticas
            </Button>
            <ButtonMemberships courseSeasonId={courseSeason.id} shiftId={shiftItem.id} urlBase={urlBase} />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal>
      <Button
        size="sm"
        variant="secondary"
        className="font-bold text-xs w-full justify-between px-4"
        onPress={() => state.open()}
      >
        <span className="flex items-center gap-2">
          <HugeiconsIcon icon={Time02Icon} size={16} className="text-accent" />
          Turnos Disponibles
        </span>
        <span className="bg-surface-container-highest px-2 py-0.5 rounded-full text-[10px]">
          {courseSeason.shifts?.length || 0}
        </span>
      </Button>

      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="inside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Time02Icon} />
              </Modal.Icon>
              <Modal.Heading>Turnos Disponibles</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                {courseSeason.name}
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6 overflow-y-auto">
              <div className="flex flex-col mt-2 mb-4">
                {courseSeason.shifts?.map(renderShift)}
                {(!courseSeason.shifts || courseSeason.shifts.length === 0) && (
                  <div className="text-center text-sm text-muted py-8">
                    No hay turnos registrados.
                  </div>
                )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
