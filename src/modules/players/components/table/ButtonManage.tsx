"use client";
import { Button, Tooltip } from "@heroui/react";
import { DashboardCircleEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCookie, deleteCookie } from "cookies-next";

interface Props {
  id: string;
}
export const ButtonManage = ({ id }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  deleteCookie("playerBackUrl");

  const handleGestion = () => {
    // Obtenemos todos los parámetros de la URL actual
    const currentQuery = searchParams.toString();
    const currentUrl = `${pathname}${currentQuery ? `?${currentQuery}` : ""}`;

    // Guardamos la ruta en el caché de sesión (sessionStorage)
    setCookie("playerBackUrl", currentUrl);

    router.push(`${pathname}/${id}`, { scroll: false });
  };
  return (
    <Tooltip delay={0}>
      <Button
        isIconOnly
        className="hover:bg-accent/30"
        size="sm"
        variant="ghost"
        onClick={handleGestion}
      >
        <HugeiconsIcon icon={DashboardCircleEditIcon} />
      </Button>
      <Tooltip.Content>
        <p>Gestionar</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
