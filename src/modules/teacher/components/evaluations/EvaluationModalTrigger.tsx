"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { Add01Icon, Edit03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  TeacherParticipant,
  TeacherEvaluationItem,
  TeacherGroupType,
} from "../../interfaces/teacher.interface";
import { EvaluationFormModal } from "./EvaluationFormModal";

interface EvaluationModalTriggerProps {
  mode: "create" | "edit";
  groupType: TeacherGroupType;
  groupId: string;
  groupName: string;
  groupDetail: string;
  participant: TeacherParticipant;
  evaluationToEdit?: TeacherEvaluationItem | null;
  buttonLabel?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "tertiary" | "danger";
}

export const EvaluationModalTrigger: React.FC<EvaluationModalTriggerProps> = ({
  mode,
  groupType,
  groupId,
  groupName,
  groupDetail,
  participant,
  evaluationToEdit,
  buttonLabel,
  variant,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {mode === "create" ? (
        <Button
          size="sm"
          variant={variant || "primary"}
          className="text-xs font-semibold"
          onPress={() => setIsOpen(true)}
        >
          <HugeiconsIcon icon={Add01Icon} size={15} />
          <span>{buttonLabel || "Nueva evaluación"}</span>
        </Button>
      ) : (
        <Button
          size="sm"
          variant={variant || "outline"}
          className="text-xs font-semibold text-default-700 hover:text-foreground"
          onPress={() => setIsOpen(true)}
        >
          <HugeiconsIcon icon={Edit03Icon} size={14} />
          <span>{buttonLabel || "Editar"}</span>
        </Button>
      )}

      {isOpen && (
        <EvaluationFormModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          groupType={groupType}
          groupId={groupId}
          groupName={groupName}
          groupDetail={groupDetail}
          participant={participant}
          evaluationToEdit={evaluationToEdit}
        />
      )}
    </>
  );
};
