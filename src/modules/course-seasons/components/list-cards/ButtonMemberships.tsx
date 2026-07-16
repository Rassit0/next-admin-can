"use client";
import { Button } from "@heroui/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  courseSeasonId: string;
  urlBase: string;
}

export const ButtonMemberships = ({ courseSeasonId, urlBase }: Props) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`${urlBase}/${courseSeasonId}/student-memberships`);
  };
  return (
    <Button
      variant="secondary"
      size="lg"
      className="w-full"
      onPress={handleNavigate}
    >
      <HugeiconsIcon icon={UserGroupIcon} />
      <span className="text-xs font-bold">Miembros</span>
    </Button>
  );
};
