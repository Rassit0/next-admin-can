"use client";
import { Button } from "@heroui/react";
import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon = mounted
    ? theme === "dark"
      ? Sun01Icon
      : Moon02Icon
    : Sun01Icon; // ícono estable en SSR

  return (
    <Button
      size="lg"
      onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      isIconOnly
      variant="ghost"
    >
      {<HugeiconsIcon icon={Icon} className="h-7 w-7 " />}

      <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
    </Button>
  );
};
