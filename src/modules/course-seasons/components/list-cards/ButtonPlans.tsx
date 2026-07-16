"use client";
import { Button } from "@heroui/react";
import { Money03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  courseSeasonId: string;
  urlBase: string;
}

export const ButtonPlans = ({ courseSeasonId, urlBase }: Props) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`${urlBase}/${courseSeasonId}/payment-plans`);
  };
  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      onPress={handleNavigate}
    >
      <HugeiconsIcon icon={Money03Icon} />
      <span className="text-xs font-bold">Planes</span>
    </Button>
  );
};
