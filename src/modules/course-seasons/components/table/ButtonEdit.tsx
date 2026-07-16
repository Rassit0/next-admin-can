"use client";
import { Button, Tooltip } from "@heroui/react";
import {
  Add01Icon,
  CardExchange01Icon,
  DashboardCircleSettingsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  urlBase: string;
  courseSeasonId: string;
}
export const ButtonAdd = ({ urlBase, courseSeasonId }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(`${urlBase}/${courseSeasonId}/add`, {
      scroll: false,
    });
  };
  return (
    <Button
      className="hover:bg-accent/30"
      variant="primary"
      onClick={handleAdd}
    >
      <HugeiconsIcon icon={Add01Icon} />
      Crear oferta
    </Button>
  );
};
