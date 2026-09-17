"use client";
import { Button, Dropdown } from "@heroui/react";
import {
  MoreHorizontalCircle01Icon,
  PencilEdit01Icon,
  Delete01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { IHomeDiscipline } from "../../../interfaces/home-discipline.interface";
import { EditHomeDisciplineModal } from "../../modal/EditHomeDisciplineModal";
import { DeleteHomeDisciplineModal } from "../../modal/DeleteHomeDisciplineModal";

interface Props {
  homeDiscipline: IHomeDiscipline;
}

export const HomeDisciplineActionDropdown = ({ homeDiscipline }: Props) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
      <Dropdown>
        <Button isIconOnly variant="ghost" size="sm" className="border-none">
          <HugeiconsIcon icon={MoreHorizontalCircle01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu aria-label="Acciones del bloque" onAction={(key) => {
            if (key === "edit") setIsEditModalOpen(true);
            if (key === "delete") setIsDeleteModalOpen(true);
          }}>
            <Dropdown.Item key="edit" id="edit" textValue="Editar">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={PencilEdit01Icon} />
                Editar
              </div>
            </Dropdown.Item>
            <Dropdown.Item
              key="delete"
              id="delete"
              textValue="Eliminar"
              className="text-danger hover:text-danger hover:bg-danger/10"
            >
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={Delete01Icon} />
                Eliminar
              </div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      <EditHomeDisciplineModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        homeDiscipline={homeDiscipline}
      />

      <DeleteHomeDisciplineModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        id={homeDiscipline.id}
      />
    </>
  );
};
