"use client";

import { Modal } from "@heroui/react";
import { ScheduleForm } from "./schedule-form";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  teamSeasonId?: string;
  courseSeasonId?: string;
}

export const ScheduleModal = ({ isOpen, onOpenChange, teamSeasonId, courseSeasonId }: Props) => {
  return (
    <Modal>
      <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-2xl bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Programar Horario Recurrente</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-0 md:p-6">
              <ScheduleForm
                teamSeasonId={teamSeasonId}
                courseSeasonId={courseSeasonId}
                onSubmited={() => {
                  onOpenChange(false);
                }}
                onCancel={() => onOpenChange(false)}
              />
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
