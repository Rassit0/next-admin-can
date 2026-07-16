"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Money01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { CreateMassiveManualChargeDrawer } from "@/modules/student-memberships";

export const CreateMassiveManualChargeButton = ({
  courseSeasonId,
}: {
  courseSeasonId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        <HugeiconsIcon icon={Money01Icon} size={18} />
        Cargo Masivo
      </Button>
      <CreateMassiveManualChargeDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        courseSeasonId={courseSeasonId}
      />
    </>
  );
};
