"use client";

import { Drawer } from "@heroui/react";
import { FormCategory } from "./FormCategory";
import { ICategoryOption, ITeamSeasonCategory } from "@/modules/team-seasons";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teamSeasonId: string;
  category?: ITeamSeasonCategory;
  categoriesOptions: ICategoryOption[];
}

export const DrawerCategory = ({
  teamSeasonId,
  category,
  categoriesOptions,
  isOpen,
  onClose,
}: Props) => {
  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Content placement="right">
        <Drawer.Dialog>
          <Drawer.CloseTrigger />
          <Drawer.Header>
            <Drawer.Heading>
              {category ? "Editar Categoria" : "Anadir Categoria"}
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body>
            <FormCategory
              teamSeasonId={teamSeasonId}
              category={category}
              categoriesOptions={categoriesOptions}
              onSuccess={onClose}
              onCancel={onClose}
            />
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
