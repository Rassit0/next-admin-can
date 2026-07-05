"use client";
import { ActivityType } from "@/modules/activities/interfaces/activity.interface";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useTransition } from "react";

interface Props {
  defaultType: ActivityType;
}

export const TabsNavigation = ({ defaultType }: Props) => {
  const tabs = [
    {
      id: "activities",
      label: "Actividades",
    },
    {
      id: "enrollments",
      label: "Inscripciones",
    },
  ];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Obtenemos el tipo actual de la URL de forma segura.
  // Si no existe, usamos el valor por defecto sin romper el flujo.
  const currentPage = pathname.split("/").pop();

  const handleChange = (value: string) => {
    // Si hacen clic en la pestaña que ya está activa, no hacemos nada
    if (value === currentPage) return;

    // Usamos startTransition para que Next.js priorice la respuesta visual de la pestaña
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("page"); // Resetea a página 1 al cambiar de filtro
      params.delete("search"); // Limpia búsquedas previas si aplica
      params.delete("type");

      const newPathname = currentPage
        ? pathname.split("/").slice(0, -1).join("/") + "/" + value
        : `${pathname}/${value}`;

      router.replace(`${newPathname}?${params.toString()}`, {
        scroll: false,
      });
    });
  };

  return (
    <Tabs
      className="w-full max-w-xl"
      variant="secondary"
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
