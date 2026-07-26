"use client";

import { Button } from "@heroui/react";
import { ArrowLeft01Icon, Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

export const ButtonRedirectHome = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
      <Button
        size="lg"
        variant="primary"
        className="w-full sm:w-auto font-medium px-8 py-6 shadow-xl hover:shadow-2xl transition-all border border-transparent hover:border-foreground/10 outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        onPress={() => router.push("/")}
        aria-label="Ir al inicio"
      >
        <HugeiconsIcon icon={Home01Icon} className="w-5 h-5" />
        Ir al inicio
      </Button>
    </div>
  );
};
