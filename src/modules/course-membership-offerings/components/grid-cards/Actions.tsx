"use client";
import { Button, Dropdown, Header, Label, Separator } from "@heroui/react";
import {
  AlertCircleIcon,
  CalendarAdd01Icon,
  DeleteIcon,
  Edit03Icon,
  EditIcon,
  MoreVerticalSquare01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import {
  CancelModal,
  DeleteModal,
  ExtendModal,
  FinalizeModal,
  ICourseSeason,
} from "@/modules/course-membership-offerings";

interface Props {
  courseSeason: ICourseSeason;
}

export const Actions = ({ courseSeason }: Props) => {
  const [isOpenFinalizeModal, setIsOpenFinalizeModal] = useState(false);
  const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
  const [isOpenExtendModal, setIsOpenExtendModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);

  return (
    <>
      <Dropdown>
        <Button aria-label="Menu" isIconOnly variant="ghost">
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu
            onAction={(key) => {
              if (key === "extend") {
                setIsOpenExtendModal(true);
              }
              if (key === "finalize") {
                setIsOpenFinalizeModal(true);
              }
              if (key === "cancel") {
                setIsOpenCancelModal(true);
              }
              if (key === "delete") {
                setIsOpenDeleteModal(true);
              }
            }}
          >
            {courseSeason.status !== "DRAFT" && (
              <>
                <Dropdown.Section>
                  <Header>Acciones</Header>
                  <Dropdown.Item id="extend" textValue="Extender Temporada">
                    <HugeiconsIcon
                      icon={CalendarAdd01Icon}
                      className="text-accent"
                    />
                    <Label>Extender Temporada</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="finalize" textValue="Finalizar Temporada">
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      className="text-warning"
                    />
                    <Label>Finalizar Temporada</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="cancel" textValue="Cancelar Temporada">
                    <HugeiconsIcon
                      icon={AlertCircleIcon}
                      className="text-red-700"
                    />
                    <Label>Cancelar Temporada</Label>
                  </Dropdown.Item>
                </Dropdown.Section>
                <Separator />
              </>
            )}
            {/* <Dropdown.Item id="edit" textValue="Editar">
              <HugeiconsIcon icon={Edit03Icon} />
              <Label>Editar</Label>
            </Dropdown.Item> */}
            {courseSeason.status === "DRAFT" && (
              <Dropdown.Section>
                <Header>Zona de peligro</Header>
                <Dropdown.Item id="delete" textValue="Eliminar">
                  <HugeiconsIcon className="text-red-700" icon={DeleteIcon} />
                  <Label className="text-red-700">Eliminar</Label>
                </Dropdown.Item>
              </Dropdown.Section>
            )}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      {/* {isOpenEdit && (
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
      )} */}

      {isOpenExtendModal && (
        <ExtendModal
          courseSeason={courseSeason}
          isOpen={isOpenExtendModal}
          onOpenChange={setIsOpenExtendModal}
        />
      )}
      {isOpenFinalizeModal && (
        <FinalizeModal
          courseSeason={courseSeason}
          isOpen={isOpenFinalizeModal}
          onOpenChange={setIsOpenFinalizeModal}
        />
      )}
      {isOpenCancelModal && (
        <CancelModal
          courseSeason={courseSeason}
          isOpen={isOpenCancelModal}
          onOpenChange={setIsOpenCancelModal}
        />
      )}
      {isOpenDeleteModal && (
        <DeleteModal
          courseSeason={courseSeason}
          isOpen={isOpenDeleteModal}
          onOpenChange={setIsOpenDeleteModal}
        />
      )}
    </>
  );
};
