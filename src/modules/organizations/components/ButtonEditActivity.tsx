"use client";
import { Button } from "@heroui/react";
import { Add01Icon, Edit03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  id: number;
  isDisabled: boolean;
}
export const ButtonEdit = ({ id, isDisabled }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(`/schools/activity/edit/${id}`);
  };
  return (
    <Button
      isIconOnly
      variant="ghost"
      isDisabled={isDisabled}
      onPress={handleAdd}
    >
      <HugeiconsIcon icon={Edit03Icon} />
    </Button>
  );
};
