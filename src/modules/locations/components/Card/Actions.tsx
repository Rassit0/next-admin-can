"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import {
  DeleteIcon,
  Edit03Icon,
  EditIcon,
  MoreVerticalSquare01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { DeleteModal, EditModal, IDiscipline } from "@/modules/disciplines";

interface Props {
  discipline: IDiscipline;
}

export const Actions = ({ discipline }: Props) => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  return (
    <>
      <Dropdown>
        <Button aria-label="Menu" isIconOnly variant="ghost">
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              if (key === "edit") {
                setIsOpenEdit(true);
              }
              if (key === "delete") {
                setIsOpenDelete(true);
              }
            }}
          >
            <Dropdown.Item id="edit" textValue="Editar">
              <HugeiconsIcon icon={Edit03Icon} />
              <Label>Editar</Label>
            </Dropdown.Item>
            <Dropdown.Item id="delete" textValue="Eliminar">
              <HugeiconsIcon className="text-red-700" icon={DeleteIcon} />
              <Label className="text-red-700">Eliminar</Label>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {isOpenEdit && (
        <EditModal
          discipline={discipline}
          showButton={false}
          isOpen={isOpenEdit}
          onOpenChange={setIsOpenEdit}
        />
      )}
      {isOpenDelete && (
        <DeleteModal
          discipline={discipline}
          showButton={false}
          isOpen={isOpenDelete}
          onOpenChange={setIsOpenDelete}
        />
      )}
    </>
  );
};
