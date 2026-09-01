"use client";
import { useState } from "react";
import { Button } from "@heroui/react";
import { UserAdd01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CreateUserModal } from "../modal/CreateUserModal";

export const CreateUserButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={UserAdd01Icon} size={18} />
          Nuevo Usuario
        </div>
      </Button>
      <CreateUserModal isOpen={isOpen} onOpenChange={setIsOpen} />
    </>
  );
};
