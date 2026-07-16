"use client";
import { Button, Dropdown, Label, toast } from "@heroui/react";
import {
  MoreVerticalSquare01Icon,
  PauseIcon,
  PlayIcon,
  CheckmarkCircle02Icon,
  Logout01Icon,
  PencilIcon,
  EyeIcon,
  DeleteIcon,
  Edit02Icon,
  ViewFreeIcons,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { EditModal, IStudent } from "@/modules/students";

interface Props {
  student: IStudent;
}

type Permission = "all" | "edit" | "delete" | "view";

interface ActionDef {
  key: Permission;
  label: string;
  icon: typeof PauseIcon;
  danger?: boolean;
  onPress: () => void;
}

export const StudentActions = ({ student }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [isOpenEditModal, setIsOpenEditModal] = useState(false);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  const ACTIONS_BY_PERMISSION: Record<Permission, ActionDef[]> = {
    all: [
      {
        key: "edit",
        label: "Editar",
        icon: Edit02Icon,
        onPress: () => setIsOpenEditModal(true),
      },
      {
        key: "view",
        label: "Ver",
        icon: ViewFreeIcons,
        onPress: () => setIsOpenViewModal(true),
      },
      {
        key: "delete",
        label: "Eliminar",
        icon: DeleteIcon,
        danger: true,
        onPress: () => setIsOpenDeleteModal(true),
      },
    ],
    edit: [
      {
        key: "edit",
        label: "Editar",
        icon: Edit02Icon,
        onPress: () => setIsOpenEditModal(true),
      },
      {
        key: "view",
        label: "Ver",
        icon: ViewFreeIcons,
        onPress: () => setIsOpenViewModal(true),
      },
    ],
    view: [
      {
        key: "view",
        label: "Ver",
        icon: EyeIcon,
        onPress: () => setIsOpenViewModal(true),
      },
    ],
    delete: [
      {
        key: "delete",
        label: "Eliminar",
        icon: DeleteIcon,
        danger: true,
        onPress: () => setIsOpenDeleteModal(true),
      },
    ],
  };

  const actions = ACTIONS_BY_PERMISSION["all"] ?? [];

  if (actions.length === 0) {
    return (
      <Button
        isIconOnly
        size="sm"
        variant="ghost"
        isDisabled
        aria-label="Sin acciones"
      >
        <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
      </Button>
    );
  }

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones de membresía"
          isIconOnly
          size="sm"
          variant="ghost"
          isPending={loading}
        >
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
          // onAction={(key) => run(key as MembershipLifecycleAction)}
          >
            {actions.map((action) => (
              <Dropdown.Item
                key={action.key}
                id={action.key}
                textValue={action.label}
                onPress={() => action.onPress()}
              >
                <HugeiconsIcon
                  className={action.danger ? "text-danger" : undefined}
                  icon={action.icon}
                />
                <Label className={action.danger ? "text-danger" : undefined}>
                  {action.label}
                </Label>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {isOpenEditModal && (
        <EditModal
          student={student}
          isOpen={isOpenEditModal}
          setIsOpen={setIsOpenEditModal}
          showButton={false}
        />
      )}
    </>
  );
};
