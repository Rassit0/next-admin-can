"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkBadge01Icon } from "@hugeicons/core-free-icons";
import React, { useState } from "react";
import { toast } from "sonner";
import { ITeamSeasonCategory, finalizeTeamSeasonCategory } from "@/modules/team-seasons";

interface Props {
  teamSeasonId: string;
  category: ITeamSeasonCategory;
  onSuccess?: () => void;
}

export const FinalizeCategoryModal = ({ teamSeasonId, category, onSuccess }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState("");

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await finalizeTeamSeasonCategory(teamSeasonId, category.id, notes);

      if (res.error) {
        toast.error(res.message || "Ocurrió un error al finalizar la categoría");
      } else {
        toast.success("Categoría finalizada exitosamente");
        state.close();
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="font-bold text-[10px] flex-1 bg-warning/20 text-warning hover:bg-warning hover:text-warning-foreground"
        onPress={() => state.open()}
        isDisabled={category.status === "FINISHED"}
      >
        <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} />
        Finalizar
      </Button>

      <Modal>
        <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
          <Modal.Container placement="auto" scroll="inside">
            <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Icon className="bg-warning/20 text-warning">
                  <HugeiconsIcon icon={CheckmarkBadge01Icon} />
                </Modal.Icon>
                <Modal.Heading>Finalizar Categoría Anticipadamente</Modal.Heading>
                <p className="mt-1.5 text-sm leading-5 text-muted">
                  {category.category.name} - {category.gender}
                </p>
              </Modal.Header>
              <Modal.Body className="p-4 md:p-6 overflow-y-auto">
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-warning/10 text-warning-600 rounded-lg text-xs">
                    <p className="font-bold mb-1">¡Atención! Esta acción es irreversible.</p>
                    <ul className="list-disc pl-4 space-y-1 mt-2 text-warning-700">
                      <li>Todas las membresías activas serán finalizadas de inmediato.</li>
                      <li>Los cargos generados para meses futuros serán cancelados.</li>
                      <li>Los cargos del mes vigente (y anteriores) se mantendrán.</li>
                    </ul>
                  </div>

                  <textarea
                    placeholder="Notas / Motivo de la finalización... (Opcional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-surface-container-low border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:border-warning/50 text-foreground"
                  />

                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="ghost" onPress={() => state.close()}>
                      Cancelar
                    </Button>
                    <Button
                      className="bg-warning text-warning-foreground font-bold"
                      onPress={handleFinish}
                      isPending={loading}
                    >
                      Confirmar Finalización
                    </Button>
                  </div>
                </div>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
};
