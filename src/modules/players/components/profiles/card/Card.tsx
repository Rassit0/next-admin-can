import { Button, Card, Switch } from "@heroui/react";
import {
  IdentityCardIcon,
  MoreVerticalSquare01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const CardProfile = () => {
  return (
    <Card>
      {/* <CircleDollar aria-label="Dollar sign icon" className="text-primary size-6" role="img" /> */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-accent-foreground rounded-xl flex items-center justify-center">
            <HugeiconsIcon
              icon={IdentityCardIcon}
              className="text-accent size-8"
            />
          </div>
          <Card.Header>
            <Card.Title className="text-xs font-bold uppercase">
              Empleado
            </Card.Title>
            <Card.Description className="text-lg font-bold">
              Analista de Rendimiento
            </Card.Description>
          </Card.Header>
        </div>
        <Button aria-label="Menu" isIconOnly variant="ghost">
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
      </div>
      <Card.Content className="flex justify-center">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Departamento</span>
            <span className="font-semibold">Área Deportiva</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Contrato</span>
            <span className="font-semibold">Tiempo Completo</span>
          </div>
        </div>
      </Card.Content>
      <Card.Footer className="px-4 flex items-center justify-between pt-4 border-t border-surface-container-low">
        <span className="flex items-center gap-1.5 text-xs font-bold text-tertiary">
          <span className="w-2 h-2 rounded-full bg-success"></span> ACTIVO
        </span>
        <Switch aria-label="Enable notifications">
          <Switch.Control className="bg-success">
            <Switch.Thumb />
          </Switch.Control>
        </Switch>
      </Card.Footer>
    </Card>
  );
};
