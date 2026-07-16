"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { CreateManualChargeDrawer } from "@/modules/student-memberships";

export const CreateManualChargeButton = ({
  studentMembershipId,
}: {
  studentMembershipId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        <HugeiconsIcon icon={Add01Icon} size={18} />
        Cargo Extra
      </Button>
      <CreateManualChargeDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        studentMembershipId={studentMembershipId}
      />
    </>
  );
};
