"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ScheduleModal } from "@/modules/schedules";
import { CalendarAdd01Icon } from "@hugeicons/core-free-icons";

export const ScheduleClientPage = ({
  teamSeasonId,
  courseSeasonId,
}: {
  teamSeasonId?: string;
  courseSeasonId?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Horarios (Sesiones Recurrentes)</h2>
        <Button variant="primary" onPress={() => setIsModalOpen(true)}>
          <HugeiconsIcon icon={CalendarAdd01Icon} />
          Agregar Horario
        </Button>
      </div>

      <div className="bg-content1 rounded-xl shadow-sm border border-divider p-6 text-center text-default-500">
        <p>
          Aún no has programado horarios. Agrega uno nuevo para configurar la
          recurrencia de entrenamientos o clases en el calendario.
        </p>
        <p className="text-sm mt-2">
          Próximamente: Lista detallada de horarios activos.
        </p>
      </div>

      <ScheduleModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        teamSeasonId={teamSeasonId}
        courseSeasonId={courseSeasonId}
      />
    </div>
  );
};
