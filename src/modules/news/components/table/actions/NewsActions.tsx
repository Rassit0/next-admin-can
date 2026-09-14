"use client";
import { Button, Dropdown, Label } from "@heroui/react";
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  CheckmarkCircle02Icon,
  Edit02Icon,
  DeleteIcon,
  ViewFreeIcons,
  Folder01Icon,
  ArrowLeft01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { INews } from "../../../interfaces/news.interface";
import { editNews } from "../../../actions/edit";
import { EditNewsModal } from "../../modal/EditNewsModal";
import { DeleteNewsModal } from "../../modal/DeleteNewsModal";

interface Props {
  item: INews;
}

export const NewsActions = ({ item }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const handleStatusChange = async (newStatus: "DRAFT" | "PUBLISHED" | "ARCHIVED") => {
    setLoading(true);
    const res = await editNews(item.id, item.slug, { status: newStatus });
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

    if (item.status === "DRAFT") {
      actions.push({
        key: "publish",
        label: "Publicar",
        icon: CheckmarkCircle02Icon,
        onPress: () => handleStatusChange("PUBLISHED"),
      });
    }

    if (item.status === "PUBLISHED") {
      actions.push({
        key: "archive",
        label: "Archivar",
        icon: Folder01Icon,
        onPress: () => handleStatusChange("ARCHIVED"),
      });
      actions.push({
        key: "draft",
        label: "Volver a Borrador",
        icon: ArrowLeft01Icon,
        onPress: () => handleStatusChange("DRAFT"),
      });
    }

    if (item.status === "ARCHIVED") {
      actions.push({
        key: "draft",
        label: "Volver a Borrador",
        icon: ArrowLeft01Icon,
        onPress: () => handleStatusChange("DRAFT"),
      });
    }

    actions.push({
      key: "view-public",
      label: "Ver portal web",
      icon: ViewFreeIcons,
      onPress: () => window.open(`/present/${item.slug}`, "_blank"),
    });

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
          aria-label="Acciones de noticia"
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
                <Label className={(action as any).danger ? "text-danger" : undefined}>
                  {action.label}
                </Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      
      {isOpenEditModal && (
        <EditNewsModal
          news={item}
          isOpen={isOpenEditModal}
          setIsOpen={setIsOpenEditModal}
          showButton={false}
        />
      )}

      {isOpenDeleteModal && (
        <DeleteNewsModal
          id={item.id}
          slug={item.slug}
          isOpen={isOpenDeleteModal}
          setIsOpen={setIsOpenDeleteModal}
        />
      )}
    </>
  );
};
