"use client";
import { useState } from "react";
import { AccountChargesTable, AccountChargeDrawer } from "../components";
import { IAccountCharge } from "../interfaces/charge.interface";
import { Button } from "@heroui/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";

export const CreateChargeButton = ({ direction }: { direction: "RECEIVABLE" | "PAYABLE" }) => {
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

export const AccountChargesClient = ({ charges, direction }: { charges: IAccountCharge[], direction: "RECEIVABLE" | "PAYABLE" }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<IAccountCharge | null>(null);
  const router = useRouter();

  const handleEdit = (charge: IAccountCharge) => {
    setSelectedCharge(charge);
    setIsDrawerOpen(true);
  };

  const handleCancel = async (charge: IAccountCharge) => {
    if (confirm(`¿Estás seguro de anular el registro "${charge.title}"?`)) {
      try {
        await api.delete(`account-charges/${charge.id}`);
        toast.success("Registro anulado exitosamente");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message || "Error al anular el registro");
      }
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
        onEdit={handleEdit}
        onCancel={handleCancel}
      />
      <AccountChargeDrawer
        isOpen={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        charge={selectedCharge}
        direction={direction}
        onSuccess={() => router.refresh()}
      />
    </>
  );
};
