"use client";

import { useTransition } from "react";
import { Button } from "@heroui/react";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { triggerLateFeesAction } from "../actions/trigger-late-fees";

export const TriggerLateFeesButton = () => {
  const [isPending, startTransition] = useTransition();

  const handleTrigger = () => {
    startTransition(async () => {
      try {
        const res = await triggerLateFeesAction();
        if (res.error) {
          toast.error(res.message || "Error al sincronizar moras");
        } else {
          toast.success(res.message || "Motor de moras sincronizado");
        }
      } catch (error) {
        toast.error("Ocurrió un error inesperado al sincronizar");
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      isPending={isPending}
      onPress={handleTrigger}
      className="text-default-500 hover:text-default-900"
    >
      {isPending ? "Sincronizando..." : "Sincronizar Moras"}
      {!isPending && <RefreshCcw className="w-4 h-4" />}
    </Button>
  );
};
