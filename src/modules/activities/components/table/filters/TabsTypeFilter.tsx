"use client";
import { textTypeActivity } from "@/modules/activities/constants/map-activity";
import { ActivityType } from "@/modules/activities/interfaces/activity.interface";
import { Tabs } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useTransition } from "react";

interface Props {
  defaultType: ActivityType;
  types: ActivityType[];
}

export const TabsTypeFilter = ({ defaultType, types }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Obtenemos el tipo actual de la URL de forma segura.
  // Si no existe, usamos el valor por defecto sin romper el flujo.
  const currentType = (searchParams.get("type") as ActivityType) || defaultType;

  // 2. Sincronización pasiva: Si un usuario entra a la ruta limpia (sin query string),
  // colocamos el parámetro por defecto en la barra de direcciones de forma segura tras el renderizado.
  useEffect(() => {
    if (!searchParams.get("type")) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", defaultType);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, defaultType, pathname, router]);

  const handleChange = (value: string) => {
    // Si hacen clic en la pestaña que ya está activa, no hacemos nada
    if (value === currentType) return;

    // Usamos startTransition para que Next.js priorice la respuesta visual de la pestaña
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());

      params.set("page", "1"); // Resetea a página 1 al cambiar de filtro
      params.delete("search"); // Limpia búsquedas previas si aplica

      if (value) {
        params.set("type", value);
      } else {
        params.delete("type");
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <Tabs
      className="w-full max-w-xl"
      variant="secondary"
      selectedKey={currentType}
      onSelectionChange={(key) => handleChange(key as string)}
      isDisabled={isPending} // Evita clics repetidos mientras carga el Server Component
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="Tipos de Actividades">
          {types.map((typeVal) => (
            <Tabs.Tab key={typeVal} id={typeVal}>
              {textTypeActivity[typeVal]}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
};
