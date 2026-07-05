import { Button } from "@heroui/react";
import { DashboardCircleSettingsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  clubId: string;
  id: string;
}
export const ButtonGestion = ({ id, clubId }: Props) => {
  const router = useRouter();
  const path = usePathname();
  const handleGestion = () => {
    router.push(`${path}/${id}/bid-management`, {
      scroll: false,
    });
  };
  return (
    <Button
      isIconOnly
      className="hover:bg-accent/30"
      size="sm"
      variant="ghost"
      onClick={handleGestion}
    >
      <HugeiconsIcon icon={DashboardCircleSettingsIcon} />
    </Button>
  );
};
