"use client";
import { Button } from "@heroui/react";
import { Add01Icon, Setting06FreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  organizationId: number;
}

export const ButtonManageActivities = ({ organizationId }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(`/organizations/manage/${organizationId}/activities`);
  };
  return (
    <Button
      className="hover:bg-accent/30"
      variant="primary"
      onClick={handleAdd}
    >
      <HugeiconsIcon icon={Setting06FreeIcons} />
      Gestionar Cursos
    </Button>
  );
};
