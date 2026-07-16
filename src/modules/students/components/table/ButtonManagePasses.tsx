"use client";
import { Button, Tooltip } from "@heroui/react";
import {
  ArrowDataTransferHorizontalIcon,
  DashboardCircleEditIcon,
  LicenseIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  id: string;
}
export const ButtonManagePasses = ({ id }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleGestion = () => {
    router.push(`${pathname}/${id}/passes`);
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
        <HugeiconsIcon icon={LicenseIcon} />
      </Button>
      <Tooltip.Content>
        <p>Kardex Deportivo</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
