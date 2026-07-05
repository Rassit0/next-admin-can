"use client";
import { Button, Tooltip } from "@heroui/react";
import { DashboardCircleEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
}
export const ButtonManage = ({ id }: Props) => {
  const router = useRouter();
  const handleGestion = () => {
    router.push(`/members/${id}`);
  };
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        className="hover:bg-accent/30"
        size="sm"
        variant="ghost"
        onClick={handleGestion}
      >
        <HugeiconsIcon icon={DashboardCircleEditIcon} />
      </Button>
      <Tooltip.Content>
        <p>Gestionar</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
