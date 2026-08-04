"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Money01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { AdvanceChargesDrawer as AdvanceChargesDrawerPlayer } from "@/modules/player-memberships/components/drawer/AdvanceChargesDrawer";
import { AdvanceChargesDrawer as AdvanceChargesDrawerStudent } from "@/modules/student-memberships/components/drawer/AdvanceChargesDrawer";

export const AdvanceChargeButton = ({
  playerMembershipId,
  studentMembershipId,
}: {
  playerMembershipId?: string;
  studentMembershipId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onPress={() => setIsOpen(true)}>
        <HugeiconsIcon icon={Money01Icon} size={18} />
        Adelantar Cuotas
      </Button>
      {playerMembershipId && (
        <AdvanceChargesDrawerPlayer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          playerMembershipId={playerMembershipId}
        />
      )}
      {studentMembershipId && (
        <AdvanceChargesDrawerStudent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          studentMembershipId={studentMembershipId}
        />
      )}
    </>
  );
};
