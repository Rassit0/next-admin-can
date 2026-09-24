"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import {
  MoreVerticalSquare01Icon,
  Edit02Icon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { INewsCategory } from "../../../interfaces/news-categories.interface";
import { EditNewsCategoryModal } from "../../modal/EditNewsCategoryModal";
import { DeleteNewsCategoryModal } from "../../modal/DeleteNewsCategoryModal";

interface Props {
  item: INewsCategory;
}

export const NewsCategoryActions = ({ item }: Props) => {
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const actions = [
    {
      key: "edit",
      label: "Editar",
      icon: Edit02Icon,
      onPress: () => setIsOpenEditModal(true),
    },
    {
      key: "delete",
      label: "Eliminar",
      icon: DeleteIcon,
      danger: true,
      onPress: () => setIsOpenDeleteModal(true),
    },
  ];

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones de categori­a"
          isIconOnly
          size="sm"
          variant="ghost"
        >
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu>
            {actions.map((action) => (
              <Dropdown.Item
                key={action.key}
                id={action.key}
                textValue={action.label}
                onPress={() => action.onPress()}
              >
                <HugeiconsIcon
                  className={(action as any).danger ? "text-danger" : undefined}
                  icon={action.icon}
                />
                <Label
                  className={(action as any).danger ? "text-danger" : undefined}
                >
                  {action.label}
                </Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>

      {isOpenEditModal && (
        <EditNewsCategoryModal
          category={item}
          isOpen={isOpenEditModal}
          setIsOpen={setIsOpenEditModal}
          showButton={false}
        />
      )}

      {isOpenDeleteModal && (
        <DeleteNewsCategoryModal
          id={item.id}
          isOpen={isOpenDeleteModal}
          setIsOpen={setIsOpenDeleteModal}
        />
      )}
    </>
  );
};
