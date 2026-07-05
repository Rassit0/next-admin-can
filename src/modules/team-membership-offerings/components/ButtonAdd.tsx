"use client";
import { Button } from "@heroui/react";
import { Add01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";

interface Props {
  path: string;
}
export const ButtonAdd = ({ path }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(path);
  };
  return (
    <Button
      className="hover:bg-accent/30"
      variant="primary"
      onClick={handleAdd}
    >
      <HugeiconsIcon icon={Add01Icon} />
      Agregar Actividad
    </Button>
  );
};
