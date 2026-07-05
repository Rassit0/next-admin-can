"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

interface Props {
  href: string;
}
export const ButtonManageMemberships = ({ href }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(href, { scroll: false });
  };
  return (
    <Button className="w-full" variant="primary" onPress={handleAdd}>
      <HugeiconsIcon icon={Add01Icon} />
      Gestionar Membresías
    </Button>
  );
};
