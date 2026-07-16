"use client";
import { Button } from "@heroui/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  id: string;
  text: string;
}

export const ButtonManage = ({ id, text }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const handleManage = () => {
    router.push(`${pathname}/courses/${id}/manage`);
  };
  return (
    <Button variant="tertiary" className="w-full" onPress={handleManage}>
      {text}
      <HugeiconsIcon icon={ArrowRight01Icon} />
    </Button>
  );
};
