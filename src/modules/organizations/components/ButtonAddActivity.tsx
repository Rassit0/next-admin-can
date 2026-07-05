"use client";
import { Button } from "@heroui/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  organizationId: number;
  activityParentId?: number;
}

export const ButtonAddActivity = ({
  organizationId,
  activityParentId,
}: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(
      activityParentId
        ? `/organizations/${organizationId}/manage/activities/${activityParentId}/add`
        : `/organizations/${organizationId}/manage/activities/add`,
    );
  };
  return (
    <Button
      className="hover:bg-accent/30"
      variant="primary"
      onClick={handleAdd}
    >
      <HugeiconsIcon icon={Add01Icon} />
      Agregar Actividad
    </Button>
  );
};
