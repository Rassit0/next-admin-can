import React from "react";
import { IActivity } from "@/modules/activities";
import { Button, Card, Chip } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon, SchoolTieIcon } from "@hugeicons/core-free-icons";
import { ProgressMembers } from "./ProgressMembers";

interface Props {
  activity: IActivity;
}
export const CardEducational = ({ activity }: Props) => {
  return (
    <Card className="p-0 overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
      <Card.Header className="h-48 relative overflow-hidden">
        <img
          alt="Táctica y Estrategia"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-alt="A focused group of teenage athletes listening to a coach in a modern indoor sports training facility. The lighting is soft and high-key, highlighting the clean white and blue uniforms. The atmosphere is professional and educational, fitting for an elite sports academy management dashboard."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxha2sywVRQGWdlNCHe7loLa_lIpmtfaEw8ecwn_BzYHKm1bPL9ELGyWKzGRPy_9kQbz46svRCkiUAw9wy201RcAyyOXUe76LYfZ0Uqye6jAO5XIdSdyVQUrXo5bfAxP5PCWMC15bsLSjbOLIbluqR9HI5qh7-DBpxv-dcd5EV_QXfr_ZIZbBcPsA_gGuo45zdpL-iDR5I9dxV-wUiHYb34EUDxRuoWFj2GJV8yavZA1EjRcp4frh2OcILGWf_sxd2GQHZkxOI0CAS"
        />
        <div className="absolute inset-0 bg-linear-to-t from-backdrop to-transparent"></div>
        <div className="absolute bottom-4 left-6">
          <Chip color="warning" variant="primary">
            Avanzado
          </Chip>
          <Card.Title className="text-white font-headline font-bold text-xl leading-tight">
            Táctica y Estrategia
          </Card.Title>
        </div>
      </Card.Header>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <Card.Content className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <HugeiconsIcon icon={Calendar04Icon} />
              <span className="text-xs">15 Oct - 20 Ene</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant">
              <HugeiconsIcon icon={SchoolTieIcon} />
              <span className="text-xs">Prof. Martha Ruiz</span>
            </div>
          </div>
          <ProgressMembers maxMembers={15} minMembers={0} value={15} />
        </Card.Content>
        <Card.Footer className="pt-6 grid grid-cols-2 gap-3">
          <Button variant="secondary" className="w-full">
            Ver Inscritos
          </Button>
          <Button variant="primary" className="w-full">
            Gestionar Curso
          </Button>
        </Card.Footer>
      </div>
    </Card>
  );
};
