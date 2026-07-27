"use client";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";

interface IRouteProps {
  value: string;
  title: React.ReactNode;
}

interface Props {
  routes: IRouteProps[];
  defaultRoute?: string;
  basePath?: string;
  variant?: "primary" | "secondary";
}

export const TabsRouteNavigation = ({
  routes,
  defaultRoute = "",
  basePath = "",
  variant = "secondary",
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSubPath = pathname.replace(basePath, "");

  const selectedKey =
    routes.find(
      (r) =>
        r.value === currentSubPath ||
        (r.value === "/" && currentSubPath === ""),
    )?.value || defaultRoute;

  const handleChange = (value: string) => {
    if (value === selectedKey) return;

    const nextPath = value === "/" ? basePath : `${basePath}${value}`;
    const fromContext = searchParams.get("from");
    const finalPath = fromContext
      ? `${nextPath}?from=${fromContext}`
      : nextPath;

    startTransition(() => {
      router.replace(finalPath, {
        scroll: false,
      });
    });
  };

  return (
    <Tabs
      className="w-full"
      variant={variant}
      selectedKey={selectedKey}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Navegación de secciones">
          {routes.map((route) => (
            <Tabs.Tab
              key={route.value}
              id={route.value}
              className="py-6 md:py-2"
            >
              {route.title}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
