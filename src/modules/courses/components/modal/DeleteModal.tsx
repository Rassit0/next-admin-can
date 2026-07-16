"use client";
import {
  AlertDialog,
  Button,
  ProgressCircle,
  toast,
  useOverlayState,
} from "@heroui/react";
import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Delete01Icon } from "@hugeicons/core-free-icons";
import { deleteCourse, ICourse } from "@/modules/courses";

interface Props {
  course: ICourse;
  isIcon?: boolean;
  showButton?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}
export const DeleteModal = ({
  course,
  isIcon = false,
  showButton = true,
  isOpen,
  onOpenChange,
}: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    const res = await deleteCourse(course.id);
    if (res.error) {
      toast.danger(res.message);
    } else {
      toast.success(res.message);
      state.setOpen(false);
    }
    setIsLoading(false);
    state.setOpen(false);
  };

  return (
    <AlertDialog>
      {showButton && (
        <Button
          isIconOnly={isIcon}
          variant="danger-soft"
          onPress={() => state.open()}
        >
          <HugeiconsIcon icon={Delete01Icon} />
          {!isIcon && "Eliminar"}
        </Button>
      )}
      <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>¿Eliminar equipo?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                Se eliminará permanentemente el equipo{" "}
                <strong>{course.name}</strong> si no tiene datos asociados a este.
                Esta acción no se puede deshacer.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                onPress={() => state.close()}
                variant="tertiary"
                isDisabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                onPress={handleDelete}
                variant="danger"
                isDisabled={isLoading}
              >
                {isLoading && (
                  <ProgressCircle isIndeterminate aria-label="Loading">
                    <ProgressCircle.Track>
                      <ProgressCircle.TrackCircle />
                      <ProgressCircle.FillCircle />
                    </ProgressCircle.Track>
                  </ProgressCircle>
                )}
                Eliminar
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};
