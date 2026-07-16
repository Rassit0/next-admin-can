"use client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

interface Props {
  cancelHref: string;
}
export const ButtonsSubmit = ({ cancelHref }: Props) => {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="secondary"
        onPress={() => router.push(cancelHref)}
      >
        Cancelar
      </Button>
      <Button type="submit" form="form-course-offering">
        Guardar
      </Button>
    </div>
  );
};
