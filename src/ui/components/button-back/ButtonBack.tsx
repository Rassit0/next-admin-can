"use client";
import { Button, Tooltip } from "@heroui/react";
import {
  DashboardCircleEditIcon,
  LinkBackwardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const ButtonBack = () => {
  const router = useRouter();

  const handleGestion = () => {
    router.back();
  };
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        className="hover:bg-accent/30"
        size="lg"
        variant="ghost"
        onClick={handleGestion}
      >
        <HugeiconsIcon
          className="w-8 text-accent h-8"
          icon={LinkBackwardIcon}
        />
      </Button>
      <Tooltip.Content>
        <p>Volver</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
