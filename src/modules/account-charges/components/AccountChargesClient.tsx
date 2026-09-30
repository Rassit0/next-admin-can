"use client";
import { useState } from "react";
import { AccountChargesTable, AccountChargeDrawer } from "../components";
import { IAccountCharge } from "../interfaces/charge.interface";
import { Button, AlertDialog } from "@heroui/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { cancelAccountCharge } from "../actions/cancel";
import { PayChargeDrawer } from "@/modules/charge-transactions/components/drawer/PayChargeDrawer";
import { ICharge } from "@/modules/charge-transactions/interfaces/charges.interface";

export const CreateChargeButton = ({
  direction,
}: {
  direction: "RECEIVABLE" | "PAYABLE";
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        variant="primary"
        onPress={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={18} />
        {direction === "RECEIVABLE" ? "Nuevo Cobro" : "Nuevo Pago"}
      </Button>
      <AccountChargeDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        direction={direction}
        onSuccess={() => router.refresh()}
      />
    </>
  );
};

export const AccountChargesClient = ({
  charges,
  direction,
}: {
  charges: IAccountCharge[];
  direction: "RECEIVABLE" | "PAYABLE";
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<IAccountCharge | null>(
    null,
  );
  const [chargeToCancel, setChargeToCancel] = useState<IAccountCharge | null>(
    null,
  );
  const [isCancelling, setIsCancelling] = useState(false);

  const [isPayDrawerOpen, setIsPayDrawerOpen] = useState(false);
  const [chargeToPay, setChargeToPay] = useState<ICharge | null>(null);

  const router = useRouter();

  const handleEdit = (charge: IAccountCharge) => {
    setSelectedCharge(charge);
    setIsDrawerOpen(true);
  };

  const handleCancelClick = (charge: IAccountCharge) => {
    setChargeToCancel(charge);
  };

  const handlePayClick = (accountCharge: IAccountCharge) => {
    if (!accountCharge.charge) {
      toast.error("Este registro no tiene un cargo asociado válido.");
      return;
    }
    setChargeToPay(accountCharge.charge);
    setIsPayDrawerOpen(true);
  };

  const executeCancel = async () => {
    if (!chargeToCancel) return;
    setIsCancelling(true);
    const res = await cancelAccountCharge(chargeToCancel.id);
    setIsCancelling(false);

    if (res.error) {
      toast.error(res.message || "Error al anular el registro");
    } else {
      toast.success(res.message || "Registro anulado exitosamente");
      setChargeToCancel(null);
    }
  };

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      setTimeout(() => setSelectedCharge(null), 300);
    }
  };

  return (
    <>
      <AccountChargesTable
        accountCharges={charges}
        direction={direction}
        onEdit={handleEdit}
        onCancel={handleCancelClick}
        onPay={handlePayClick}
      />
      <AccountChargeDrawer
        isOpen={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        charge={selectedCharge}
        direction={direction}
        onSuccess={() => router.refresh()}
      />

      {chargeToPay && (
        <PayChargeDrawer
          isOpen={isPayDrawerOpen}
          onOpenChange={(open) => {
            setIsPayDrawerOpen(open);
            if (!open) setTimeout(() => setChargeToPay(null), 300);
          }}
          charge={chargeToPay}
          transactionType={direction === "RECEIVABLE" ? "INCOME" : "EXPENSE"}
        />
      )}

      <AlertDialog.Backdrop
        isOpen={!!chargeToCancel}
        onOpenChange={(isOpen) => !isOpen && setChargeToCancel(null)}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>¿Anular registro?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                ¿Estás seguro de que deseas anular el registro{" "}
                <strong>{chargeToCancel?.title}</strong>? Esta acción no se
                puede deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="tertiary"
                onPress={() => setChargeToCancel(null)}
                isDisabled={isCancelling}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onPress={executeCancel}
                isPending={isCancelling}
              >
                Anular
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
};
