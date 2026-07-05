"use client";
import { Button } from "@heroui/react";
import { Add01Icon, Edit03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  href: string;
}
export const ButtonEdit = ({ href }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(href, { scroll: false });
  };
  return (
    <Button className="w-full" variant="secondary" onPress={handleAdd}>
      <HugeiconsIcon icon={Edit03Icon} />
      Seguir Editando
    </Button>
  );
};
