"use client";
import { Button, Tooltip } from "@heroui/react";
import {
  ArrowDataTransferHorizontalIcon,
  DashboardCircleEditIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
}
export const ButtonManagePasses = ({ id }: Props) => {
  const router = useRouter();
  const handleGestion = () => {
    router.push(`players/${id}/passes`);
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
        <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
      </Button>
      <Tooltip.Content>
        <p>Gestionar Pases</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
