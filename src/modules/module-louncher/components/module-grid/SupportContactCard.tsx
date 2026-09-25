import { Button, Card } from "@heroui/react";
import { CustomerService01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const SupportContactCard = () => {
  return (
    <Card className="bg-linear-to-br from-accent/30 via-default-900 to-accent p-8 shadow-lg shadow-accent/10 flex flex-col justify-center relative overflow-hidden group">
      <div className="relative z-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 mb-4">
          Soporte IT
        </p>
        <h3 className="text-lg font-headline font-bold mb-4 leading-tight">
          ¿Necesita asistencia técnica?
        </h3>
        <Button className="px-6 py-2.5 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center space-x-2 w-fit">
          <span>Contactar Soporte</span>
        </Button>
      </div>
      <HugeiconsIcon
        icon={CustomerService01Icon}
        size={200}
        className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700"
      />
    </Card>
  );
};
