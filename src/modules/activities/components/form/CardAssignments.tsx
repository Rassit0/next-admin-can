import { Card } from "@heroui/react";
import { LabelIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { Dispatch, SetStateAction } from "react";
import { AutoCompleteDiscipline } from "./AutoCompleteDiscipline";
import { AutoCompleteCategory } from "./AutoCompleteCategory";

interface Props {
  categoryIds: number[];
  setCategoryIds: Dispatch<SetStateAction<number[]>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const CardAssignments = ({
  categoryIds,
  setCategoryIds,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="col-span-12 p-8 xl:col-span-6">
      <div className="flex items-center gap-4 mb-6">
        <HugeiconsIcon
          className="text-default-foreground/50"
          icon={LabelIcon}
          strokeWidth={2}
        />
        <Card.Header>
          <Card.Title className="text-xl font-bold">Clasificación</Card.Title>
        </Card.Header>
      </div>
      <Card.Content className="space-y-6">
        <AutoCompleteCategory
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
          errors={errors}
          handleRemoveError={handleRemoveError}
        />
      </Card.Content>
    </Card>
  );
};
