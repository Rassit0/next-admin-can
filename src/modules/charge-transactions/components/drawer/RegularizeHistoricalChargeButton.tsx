"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Note01Icon as HistoryIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { RegularizeHistoricalChargeDrawer } from "./RegularizeHistoricalChargeDrawer";

export const RegularizeHistoricalChargeButton = ({
  playerMembershipId,
  studentMembershipId,
}: {
  playerMembershipId?: string;
  studentMembershipId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const membershipId = playerMembershipId || studentMembershipId;
  const type = playerMembershipId ? "membership" : "student";

  if (!membershipId) return null;

  return (
    <>
      <Button variant="outline" onPress={() => setIsOpen(true)}>
        <HugeiconsIcon icon={HistoryIcon} size={18} />
        Regularizar Histórico
      </Button>
      
      <RegularizeHistoricalChargeDrawer
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        membershipId={membershipId}
        type={type}
      />
    </>
  );
};
