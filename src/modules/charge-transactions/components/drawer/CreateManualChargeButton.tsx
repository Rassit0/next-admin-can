"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { CreateManualChargeDrawer as CreateManualChargeDrawerPlayer } from "@/modules/player-memberships";
import { CreateManualChargeDrawer as CreateManualChargeDrawerStudent } from "@/modules/student-memberships";

export const CreateManualChargeButton = ({
  playerMembershipId,
  studentMembershipId,
}: {
  playerMembershipId?: string;
  studentMembershipId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        <HugeiconsIcon icon={Add01Icon} size={18} />
        Cargo Extra
      </Button>
      {playerMembershipId && (
        <CreateManualChargeDrawerPlayer
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          playerMembershipId={playerMembershipId}
        />
      )}
      {studentMembershipId && (
        <CreateManualChargeDrawerStudent
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          studentMembershipId={studentMembershipId}
        />
      )}
    </>
  );
};
