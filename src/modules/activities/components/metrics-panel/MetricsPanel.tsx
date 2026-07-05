import { Card } from "@heroui/react";
import { Calendar03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const MetricsPanel = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="col-span-1 flex flex-row justify-between items-center border-l-4 border-accent p-6">
        <div className="flex flex-col gap-2">
          <Card.Header>
            <Card.Title className="uppercase tracking-widest text-foreground/50">
              Próximo Evento
            </Card.Title>
          </Card.Header>

          <Card.Content className="font-bold text-2xl">
            vs Ingenieros
          </Card.Content>
          <Card.Description>Sábado, 16:00</Card.Description>
        </div>
        <div className="bg-accent-soft p-3 rounded-lg">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={24}
            className="text-accent"
          />
        </div>
      </Card>
      <Card className="col-span-1 flex flex-row justify-between items-center p-6">
        <div className="flex flex-col gap-2">
          <Card.Header>
            <Card.Title className="uppercase tracking-widest text-foreground/50">
              Entrenamientos
            </Card.Title>
          </Card.Header>

          <Card.Content className="font-bold text-2xl">
            4 programados
          </Card.Content>
          <Card.Description>
            Sedes: Cancha el CAN, Cantera y Cancha 2
          </Card.Description>
        </div>
        <div className="bg-accent-soft p-3 rounded-lg">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={24}
            className="text-accent"
          />
        </div>
      </Card>
      <Card className="col-span-1 flex flex-row justify-between items-center p-4">
        <div className="flex flex-col gap-2">
          <Card.Header>
            <Card.Title className="uppercase tracking-widest text-foreground/50">
              Asistencia Promedio
            </Card.Title>
          </Card.Header>

          <Card.Content className="font-bold text-2xl">92.2%</Card.Content>

          <Card.Description>+2.4% vs mes anterior</Card.Description>
        </div>
        <div className="bg-accent-soft p-3 rounded-lg">
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={24}
            className="text-accent"
          />
        </div>
      </Card>
    </section>
  );
};
