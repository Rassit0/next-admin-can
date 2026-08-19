"use client";
import { Button } from "@heroui/react";
import { UserGroupIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  courseSeasonId: string;
  shiftId?: string;
  urlBase: string;
}

export const ButtonMemberships = ({ courseSeasonId, shiftId, urlBase }: Props) => {
  const router = useRouter();
  const handleNavigate = () => {
    let url = `${urlBase}/${courseSeasonId}/student-memberships`;
    if (shiftId) {
      url += `?shiftId=${shiftId}`;
    }
    router.push(url);
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
