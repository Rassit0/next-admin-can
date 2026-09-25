"use client";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useTransition } from "react";

interface IQueryProps {
  value: string;
  title: React.ReactNode;
}

interface Props {
  queryProp: string;
  queryPropValueDefault: string;
  props: IQueryProps[];
}

export const TabsTypeFilterQueryProps = ({
  queryProp,
  queryPropValueDefault,
  props,
}: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const queryPropValue = searchParams.get(queryProp) || queryPropValueDefault;

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set(queryProp, value);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <Tabs
      className="w-full max-w-xl"
      variant="secondary"
      selectedKey={queryPropValue}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending} // Evita clics repetidos mientras carga el Server Component
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Pestañas">
          {props.map((prop) => (
            <Tabs.Tab key={prop.value} id={prop.value}>
              {prop.title}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
