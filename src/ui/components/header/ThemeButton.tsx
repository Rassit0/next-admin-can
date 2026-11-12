"use client";
import { Button } from "@heroui/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export const ThemeButton = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isDark = mounted && resolvedTheme === "dark";
  const Icon = isDark ? Sun01Icon : Moon02Icon;
  const label = isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro";

  return (
    <Button
      size="md"
      onPress={() => setTheme(isDark ? "light" : "dark")}
      isIconOnly
      variant="ghost"
      aria-label={label}
      className="h-9 w-9 min-w-9 rounded-full text-foreground/80 hover:text-foreground hover:bg-surface-secondary/80"
    >
      <HugeiconsIcon icon={Icon} className="h-5 w-5" />
    </Button>
  );
};
