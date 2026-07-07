"use client";
import { Button, Modal, useOverlayState } from "@heroui/react";
import { Add01Icon, Layers01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FormPaymentPlan } from "@/modules/payment-plans";

interface Props {
  teamSeasonId: string;
  teamSeasonBillingType?: string;
}

export const AddModal = ({ teamSeasonId, teamSeasonBillingType }: Props) => {
  const state = useOverlayState();
  const [loading, setLoading] = useState(false);

  return (
    <Modal>
      <Button
        className="hidden md:flex"
        variant="primary"
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Add01Icon} />
        Agregar Plan
      </Button>
      <Button
        className="flex md:hidden"
        isIconOnly
        variant="primary"
        onPress={() => state.open()}
      >
        <HugeiconsIcon icon={Add01Icon} />
      </Button>
      {/* <ButtonFloating
        icon={
          <HugeiconsIcon icon={Add01Icon} className="h-6 w-6 text-background" />
        }
        onPress={() => state.open()}
        // text="Agregar Disciplina"
      /> */}
      <Modal.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <Modal.Container placement="auto" scroll="outside">
          <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                <HugeiconsIcon icon={Layers01Icon} />
              </Modal.Icon>
              <Modal.Heading>Agregar Categoría</Modal.Heading>
              <p className="mt-1.5 text-sm leading-5 text-muted">
                Agrega un nuevo plan de pago al sistema.
              </p>
            </Modal.Header>
            <Modal.Body className="p-6">
              <FormPaymentPlan
                formId="add-payment-plan-form"
                teamSeasonId={teamSeasonId}
                teamSeasonBillingType={teamSeasonBillingType}
                onSubmited={() => state.close()}
                isLoading={loading}
                setIsLoading={setLoading}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => state.close()}
                isDisabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                form="add-payment-plan-form"
                // isDisabled={loading}
                isPending={loading}
              >
                Guardar
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
