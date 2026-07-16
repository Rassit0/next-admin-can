"use client";
import { Button } from "@heroui/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  urlBase: string;
  courseSeasonId: string;
}

export const ButtonEdit = ({ urlBase, courseSeasonId }: Props) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`${urlBase}/${courseSeasonId}/edit`);
  };
  return (
    <Button
      onPress={handleEdit}
      className="w-full py-3.5 bg-warning text-white rounded-full font-extrabold text-md hover:bg-primary-container transition-all flex items-center justify-center gap-2"
    >
      <HugeiconsIcon icon={Edit02Icon} strokeWidth={3} />
      Editar Temporada
    </Button>
  );
};
