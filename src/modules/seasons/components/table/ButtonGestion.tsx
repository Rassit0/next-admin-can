import { Button } from "@heroui/react";
import { DashboardCircleEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}
export const ButtonGestion = ({ id }: Props) => {
  const router = useRouter();
  const handleGestion = () => {
    router.push(`/seasons/${id}/manage`);
  };
  return (
    <Button
      isIconOnly
      className="hover:bg-accent/30"
      size="sm"
      variant="ghost"
      onClick={handleGestion}
    >
      <HugeiconsIcon icon={DashboardCircleEditIcon} />
    </Button>
  );
};
