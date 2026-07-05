import { iconMap } from "@/utils";
import { Card, Description, Label, Radio, RadioGroup } from "@heroui/react";
import { GeometricShapes01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";
import React from "react";
import { ActivityType } from "../../interfaces/activity.interface";

const tipeActivities: {
  value: ActivityType;
  icon: any;
  label: string;
  description: string;
}[] = [
  {
    value: "TRAINING",
    icon: iconMap["TRAINING"],
    label: "Entrenamiento",
    description: "Sesiones técnicas y preparación física del equipo.",
  },
  {
    value: "MATCH",
    icon: iconMap["MATCH"],
    label: "Partido",
    description: "Encuentros oficioales o amistosos programados.",
  },
  {
    value: "EDUCATIONAL",
    icon: iconMap["EDUCATIONAL"],
    label: "Educativo",
    description: "Clases, talleres y formación teórica deportiva.",
  },
  {
    value: "EVENT",
    icon: iconMap["EVENT"],
    label: "Evento",
    description: "Actividades sociales, prensa o presentaciones.",
  },
  {
    value: "TEAM",
    icon: iconMap["TEAM"],
    label: "Equipo",
    description: "Actividades de conformación de equipos.",
  },
];

interface Props {
  typesPermits: ActivityType[] | "all";
  type: ActivityType;
  setType: (value: ActivityType) => void;
  errors: Record<string, string>;
  setErrors: (value: Record<string, string>) => void;
  handleRemoveError: (fieldName: string) => void;
}

export const CardTypeActivity = ({
  typesPermits,
  type,
  setType,
  errors,
  setErrors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="col-span-12 p-8 border-l-6 border-blue-900">
      <div className="flex items-center gap-4 mb-2">
        <HugeiconsIcon
          className="text-accent"
          icon={GeometricShapes01Icon}
          strokeWidth={2}
        />
        <Card.Header>
          <Card.Title className="text-xl font-bold">
            Paso 1: Selecciona Tipo de Actividad
          </Card.Title>
        </Card.Header>
      </div>
      <RadioGroup
        defaultValue="express"
        name="delivery"
        variant="primary"
        value={type}
        onChange={(value) => {
          setType(value as ActivityType);
          handleRemoveError("type");
        }}
      >
        <div className="grid gap-x-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {tipeActivities
            .filter((type) =>
              typesPermits === "all" ? true : typesPermits.includes(type.value),
            )
            .map((type) => (
              <Radio
                key={type.value}
                value={type.value}
                className={clsx(
                  "group relative flex-col gap-4 rounded-xl border border-transparent bg-default px-5 py-4 transition-all data-[selected=true]:border-accent data-[selected=true]:bg-accent/10",
                  "data-[focus-visible=true]:border-accent data-[focus-visible=true]:bg-accent/10",
                  "items-center",
                )}
              >
                <Radio.Control className="absolute top-3 right-4 size-5">
                  <Radio.Indicator />
                </Radio.Control>
                <HugeiconsIcon icon={type.icon} size={40} />
                <Radio.Content className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1 items-center">
                    <Label className="text-xl font-bold">{type.label}</Label>
                    <Description className="text-sm text-center">
                      {type.description}
                    </Description>
                  </div>
                </Radio.Content>
              </Radio>
            ))}
        </div>
      </RadioGroup>
    </Card>
  );
};
