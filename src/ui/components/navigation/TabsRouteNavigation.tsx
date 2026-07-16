"use client";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";

interface IRouteProps {
  value: string;
  title: React.ReactNode;
}

interface Props {
  routes: IRouteProps[];
  defaultRoute?: string;
  basePath?: string;
}

export const TabsRouteNavigation = ({
  routes,
  defaultRoute = "",
  basePath = "",
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const currentSubPath = pathname.replace(basePath, "");
  
  const selectedKey = routes.find(r => r.value === currentSubPath || (r.value === '/' && currentSubPath === ''))?.value || defaultRoute;

  const handleChange = (value: string) => {
    if (value === selectedKey) return;
    
    const nextPath = value === "/" ? basePath : `${basePath}${value}`;

    startTransition(() => {
      router.push(nextPath, {
        scroll: false,
      });
    });
  };

  return (
    <Tabs
      className="w-full"
      variant="secondary"
      selectedKey={selectedKey}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Navegación de secciones">
          {routes.map((route) => (
            <Tabs.Tab key={route.value} id={route.value} className="py-6 md:py-2">
              {route.title}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
