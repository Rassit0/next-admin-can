"use client";
import { Button, Tooltip } from "@heroui/react";
import {
  CardExchange01Icon,
  DashboardCircleSettingsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  urlBase: string;
  courseSeasonId: string;
}
export const ButtonOfferings = ({ urlBase, courseSeasonId }: Props) => {
  const router = useRouter();
  const handleGestion = () => {
    router.push(`${urlBase}/${courseSeasonId}/membership-offerings`, {
      scroll: false,
    });
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
        <HugeiconsIcon icon={CardExchange01Icon} />
      </Button>
      <Tooltip.Content showArrow placement="bottom">
        <Tooltip.Arrow />
        <p>Ofertas de Membresía</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
