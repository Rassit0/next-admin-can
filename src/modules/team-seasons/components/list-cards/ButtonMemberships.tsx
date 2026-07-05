"use client";
import { Button } from "@heroui/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  teamSeasonId: string;
  urlBase: string;
}

export const ButtonMemberships = ({ teamSeasonId, urlBase }: Props) => {
  const router = useRouter();
  const handleNavigate = () => {
    router.push(`${urlBase}/${teamSeasonId}/player-memberships`);
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
