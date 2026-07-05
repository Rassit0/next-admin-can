"use client";
import { Button } from "@heroui/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { ActivityType } from "@/modules/activities";

interface Props {
  organizationId: number | null;
  activityId: number;
  text: string;
}

export const ButtonManage = ({ organizationId, activityId, text }: Props) => {
  const router = useRouter();
  const handleManage = () => {
    router.push(
      organizationId
        ? `/organizations/${organizationId}/manage/activities/${activityId}/manage/activities`
        : `/activities/${activityId}/manage`,
    );
  };
  return (
    <Button variant="tertiary" className="w-full" onPress={handleManage}>
      {text}
      <HugeiconsIcon icon={ArrowRight01Icon} />
    </Button>
  );
};
