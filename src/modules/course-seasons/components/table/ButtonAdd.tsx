"use client";
import { ButtonFloating } from "@/ui";
import { Button, Tooltip } from "@heroui/react";
import {
  Add01Icon,
  CardExchange01Icon,
  DashboardCircleSettingsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  urlBase: string;
  buttonFloatingMobile?: boolean;
}
export const ButtonAdd = ({ urlBase, buttonFloatingMobile }: Props) => {
  const router = useRouter();
  const handleAdd = () => {
    router.push(`${urlBase}/add`, {
      scroll: false,
    });
  };
  return (
    <>
      <Button
        className="hidden lg:flex hover:bg-accent/30"
        variant="primary"
        onClick={handleAdd}
      >
        <HugeiconsIcon icon={Add01Icon} />
        Crear oferta
      </Button>
      {buttonFloatingMobile && (
        <ButtonFloating
          className="lg:hidden"
          icon={
            <HugeiconsIcon
              icon={Add01Icon}
              className="h-6 w-6 text-background"
            />
          }
          onPress={handleAdd}
          // text="Agregar Disciplina"
        />
      )}
    </>
  );
};
