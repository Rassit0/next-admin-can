"use client";
import { Button } from "@heroui/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  text: string;
}

export const ButtonManage = ({ id, text }: Props) => {
  const router = useRouter();
  const handleManage = () => {
    router.push(`/organizations/${id}/manage`);
  };
  return (
    <Button variant="tertiary" className="w-full" onPress={handleManage}>
      {text}
      <HugeiconsIcon icon={ArrowRight01Icon} />
    </Button>
  );
};
