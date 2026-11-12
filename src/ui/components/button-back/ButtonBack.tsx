"use client";
import { Button, Tooltip } from "@heroui/react";
import { LinkBackwardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export const ButtonBack = () => {
  const router = useRouter();

  const handleGestion = () => {
    router.back();
  };
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        aria-label="Volver"
        className="h-9 w-9 min-w-9 rounded-xl hover:bg-accent/20"
        size="md"
        variant="ghost"
        onPress={handleGestion}
      >
        <HugeiconsIcon
          className="w-5 h-5 text-accent"
          icon={LinkBackwardIcon}
        />
      </Button>
      <Tooltip.Content>
        <p>Volver</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
