import { Button } from "@heroui/react";
import { DashboardCircleSettingsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  id: string;
}
export const ButtonGestion = ({ id }: Props) => {
  const router = useRouter();
  const path = usePathname();
  const handleGestion = () => {
    router.push(`${path}/${id}/manage`);
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
