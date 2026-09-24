"use client";

import React, { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { CheckmarkCircle01Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  email: string;
  password?: string;
  title?: string;
  description?: string;
}

export const CredentialAlertDialog: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  email,
  password,
  title = "Credenciales de Usuario",
  description = "Copia estas credenciales. Por seguridad, la contrasei±a no se volveri¡ a mostrar.",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `Email: ${email}\nPassword: ${password || ""}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <AlertDialog isOpen={isOpen} onOpenChange={onOpenChange}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-100">
            <AlertDialog.CloseTrigger />
            <AlertDialog.Header>
              <AlertDialog.Icon status="success" />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p className="text-sm text-default-500 mb-4">{description}</p>
              <div className="bg-surface-secondary p-4 rounded-xl border border-border flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-default-400 font-semibold uppercase tracking-wider">
                    Correo Electrónico
                  </span>
                  <span className="text-sm font-medium">{email}</span>
                </div>
                {password && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-xs text-default-400 font-semibold uppercase tracking-wider">
                      Contrasei±a Temporal
                    </span>
                    <span className="text-sm font-mono font-medium">
                      {password}
                    </span>
                  </div>
                )}
              </div>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                onPress={handleCopy}
                variant="tertiary"
                className={copied ? "text-success" : ""}
              >
                <HugeiconsIcon
                  icon={copied ? CheckmarkCircle01Icon : Copy01Icon}
                  size={18}
                />
                {copied ? "Copiado!" : "Copiar Credenciales"}
              </Button>
              <Button variant="primary" onPress={() => onOpenChange(false)}>
                Entendido
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
};
