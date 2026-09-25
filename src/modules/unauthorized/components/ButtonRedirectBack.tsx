"use client";

import { Button } from "@heroui/react";
import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export const ButtonRedirectBack = () => {
  const router = useRouter();

  return (
    <>
      <Button
        size="lg"
        variant="primary"
        className="w-full sm:w-auto font-medium px-8 py-6 transition-all outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onPress={() => router.back()}
        aria-label="Volver atrás"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="w-5 h-5" />
        Volver atrás
      </Button>
    </>
  );
};
