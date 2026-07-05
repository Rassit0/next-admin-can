"use client";

import { Button } from "@heroui/react";

interface AssignmentModalProps {
  teamSeasonId: string;
  onAssignmentSuccess?: () => void;
}

export const AssignmentModal = ({
  teamSeasonId,
  onAssignmentSuccess,
}: AssignmentModalProps) => {
  return (
    <Button
      size="md"
      className="font-semibold bg-accent text-accent-foreground"
    >
      Asignar Membresía
    </Button>
  );
};
