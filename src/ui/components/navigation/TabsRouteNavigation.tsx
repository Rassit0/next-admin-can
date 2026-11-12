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

  const currentSubPath =
    basePath && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length)
      : pathname;

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
      className="w-full max-w-full"
      variant={variant}
      selectedKey={selectedKey}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending}
    >
      <Tabs.ListContainer className="max-w-full">
        <Tabs.List aria-label="Navegación de secciones">
          {routes.map((route) => (
            <Tabs.Tab
              key={route.value}
              id={route.value}
            // className="h-9 md:h-8 py-1.5 px-3 sm:px-4 whitespace-nowrap shrink-0 text-xs sm:text-sm data-[selected=true]:font-semibold"
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
