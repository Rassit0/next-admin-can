"use client";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useTransition } from "react";

interface Path {
  href: string;
  label: React.ReactNode;
}

interface Props {
  paths: Path[];
}

export const TabsTypeFilter = ({ paths }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  console.log(pathname);
  const handleChange = (value: string) => {
    startTransition(() => {
      router.push(value, { scroll: false });
    });
  };

  return (
    <Tabs
      className="w-full max-w-xl"
      variant="secondary"
      selectedKey={pathname}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending} // Evita clics repetidos mientras carga el Server Component
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Pestañas">
          {paths.map((path) => (
            <Tabs.Tab key={path.href} id={path.href}>
              {path.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
