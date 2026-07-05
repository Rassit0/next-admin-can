import { Button, Tooltip } from "@heroui/react";
import {
  Calendar02Icon,
  DashboardCircleSettingsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  teamId: string;
  urlBase: string;
}
export const ButtonGestion = ({ teamId, urlBase }: Props) => {
  const router = useRouter();
  const path = usePathname();
  const handleGestion = () => {
    router.push(`${urlBase}/${teamId}/team-seasons`, {
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
        <HugeiconsIcon icon={Calendar02Icon} />
      </Button>
      <Tooltip.Content showArrow placement="bottom">
        <Tooltip.Arrow />
        <p>Gestionar temporadas del equipo</p>
      </Tooltip.Content>
    </Tooltip>
  );
};
