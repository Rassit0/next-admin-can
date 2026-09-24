"use client";

import { Modal } from "@heroui/react";
import { useRouter } from "next/navigation";

export function ProfileModalShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      router.back();
    }
  };

  return (
    <Modal>
      <Modal.Backdrop isOpen={true} onOpenChange={handleOpenChange}>
        <Modal.Container size="cover">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Mi Perfil</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="overflow-y-auto pb-6">
              {children}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
