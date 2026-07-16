"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { PayChargeDrawer } from "@/modules/charge-transactions";
import { ICharge } from "@/modules/charge-transactions";

export const PayChargeButton = ({ charge }: { charge: ICharge }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        <HugeiconsIcon icon={Add01Icon} size={18} />
        Registrar Pago
      </Button>
      <PayChargeDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        charge={charge}
      />
    </>
  );
};
