"use client";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";

export const TabsNavigation = () => {
  const tabs = [
    {
      id: "all",
      label: "Todos",
    },
    {
      id: "ACTIVE",
      label: "Activos",
    },
    {
      id: "DRAFT",
      label: "Borradores",
    },
    {
      id: "FINISHED",
      label: "Finalizados",
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Obtenemos el tipo actual de la URL de forma segura.
  // Si no existe, usamos el valor por defecto sin romper el flujo.
  const currentPage = searchParams.get("status") || "all";

  const handleChange = (value: string | "all") => {
    // Si hacen clic en la pestaña que ya está activa, no hacemos nada
    if (value === currentPage) return;

    // Usamos startTransition para que Next.js priorice la respuesta visual de la pestaña
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === "all") {
        params.delete("status");
      } else {
        params.set("status", value);
      }

      router.replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <Tabs
      className="w-full max-w-xl"
      variant="primary"
      selectedKey={currentPage}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending} // Evita clics repetidos mientras carga el Server Component
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Tipos de Actividades">
          {tabs.map((tab) => (
            <Tabs.Tab key={tab.id} id={tab.id}>
              {tab.label}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
