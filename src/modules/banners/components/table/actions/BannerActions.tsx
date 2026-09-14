"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  CheckmarkCircle02Icon,
  CancelCircleHalfDotIcon,
  Edit02Icon,
  DeleteIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { IBanner } from "../../../interfaces/banners.interface";
import { editBanner } from "../../../actions/edit";
import { EditBannerModal } from "../../modal/EditBannerModal";
import { DeleteBannerModal } from "../../modal/DeleteBannerModal";

interface Props {
  item: IBanner;
}

export const BannerActions = ({ item }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const handleStatusChange = async (newStatus: boolean) => {
    setLoading(true);
    const res = await editBanner(item.id, { isActive: newStatus });
    setLoading(false);

    if (res.error) {
      toast.error("Error al cambiar el estado", { description: res.message });
      return;
    }
    toast.success("Estado actualizado correctamente");
  };

  const getActions = () => {
    const actions = [
      {
        key: "edit",
        label: "Editar",
        icon: Edit02Icon,
        onPress: () => setIsOpenEditModal(true),
      },
    ];

    if (item.isActive) {
      actions.push({
        key: "deactivate",
        label: "Desactivar",
        icon: CancelCircleHalfDotIcon,
        onPress: () => handleStatusChange(false),
      });
    } else {
      actions.push({
        key: "activate",
        label: "Activar",
        icon: CheckmarkCircle02Icon,
        onPress: () => handleStatusChange(true),
      });
    }

    actions.push({
      key: "delete",
      label: "Eliminar",
      icon: DeleteIcon,
      // @ts-ignore
      danger: true,
      onPress: () => setIsOpenDeleteModal(true),
    });

    return actions;
  };

  const actions = getActions();

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones de banner"
          isIconOnly
          size="sm"
          variant="ghost"
          isPending={loading}
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
        <EditBannerModal
          banner={item}
          isOpen={isOpenEditModal}
          setIsOpen={setIsOpenEditModal}
          showButton={false}
        />
      )}

      {isOpenDeleteModal && (
        <DeleteBannerModal
          id={item.id}
          isOpen={isOpenDeleteModal}
          setIsOpen={setIsOpenDeleteModal}
        />
      )}
    </>
  );
};
