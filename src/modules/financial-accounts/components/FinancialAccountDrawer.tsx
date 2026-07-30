"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Input,
  Select,
  ListBox,
  Label,
  Switch,
} from "@heroui/react";
import { Cancel01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { FinancialAccount } from "../interfaces/financial-account.interface";
import { createFinancialAccount } from "../actions/create";
import { updateFinancialAccount } from "../actions/update";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  accountToEdit?: FinancialAccount | null;
  onSuccess?: () => void;
}

export const FinancialAccountDrawer = ({
  isOpen,
  onOpenChange,
  accountToEdit,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"CASH" | "BANK" | "DIGITAL_WALLET">("BANK");
  const [accountNumber, setAccountNumber] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [initialBalance, setInitialBalance] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      if (accountToEdit) {
        setName(accountToEdit.name);
        setDescription(accountToEdit.description || "");
        setType(accountToEdit.type);
        setAccountNumber(accountToEdit.accountNumber || "");
        setIsDefault(accountToEdit.isDefault || false);
        setIsActive(accountToEdit.isActive ?? true);
        setInitialBalance("");
      } else {
        setName("");
        setDescription("");
        setType("BANK");
        setAccountNumber("");
        setIsDefault(false);
        setIsActive(true);
        setInitialBalance("");
      }
    }
  }, [isOpen, accountToEdit]);

  const handleSubmit = async () => {
    if (!name || !type) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        name,
        description,
        type,
        accountNumber,
        isDefault,
      };

      if (accountToEdit) {
        await updateFinancialAccount(accountToEdit.id, { ...data, isActive });
        toast.success("Cuenta actualizada exitosamente");
      } else {
        const { error, data: res } = await createFinancialAccount({
          ...data,
          initialBalance: initialBalance ? Number(initialBalance) : undefined,
        });
        if (error) {
          toast.error("Error al crear la cuenta");
        } else {
          toast.success("Cuenta creada exitosamente");
        }
      }

      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  const accountTypes = [
    { value: "CASH", label: "Caja Físico / Efectivo" },
    { value: "BANK", label: "Cuenta Bancaria" },
    { value: "DIGITAL_WALLET", label: "Billetera Digital" },
  ];

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <Drawer.Heading className="text-lg font-bold">
              {accountToEdit ? "Editar Cuenta" : "Nueva Cuenta Financiera"}
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="gap-6 pt-6">
            <div className="flex flex-col gap-6">
              <div>
                <Label className="mb-1 text-sm font-semibold">
                  Nombre de la cuenta
                </Label>
                <Input
                  placeholder="Ej: Banco Mercantil Santa Cruz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="secondary"
                />
              </div>

              <Select
                value={type}
                onChange={(val) => setType(val as any)}
                isRequired
                variant="secondary"
              >
                <Label>Tipo de Cuenta</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover className="bg-default">
                  <ListBox>
                    {accountTypes.map((t) => (
                      <ListBox.Item
                        key={t.value}
                        id={t.value}
                        textValue={t.label}
                      >
                        {t.label}
                      </ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <div>
                <Label className="mb-1 text-sm font-semibold">
                  Número de Cuenta (Opcional)
                </Label>
                <Input
                  placeholder="Ej: 4010123456"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  variant="secondary"
                />
              </div>

              {!accountToEdit && (
                <div>
                  <Label className="mb-1 text-sm font-semibold">
                    Saldo Inicial (Opcional)
                  </Label>
                  <Input
                    placeholder="0.00"
                    type="number"
                    value={initialBalance}
                    onChange={(e) => setInitialBalance(e.target.value)}
                    variant="secondary"
                  />
                  <span className="text-xs text-default-500 mt-1 block">
                    Este saldo generará un Asiento de Apertura
                  </span>
                </div>
              )}

              <div>
                <Label className="mb-1 text-sm font-semibold">
                  Descripción (Opcional)
                </Label>
                <Input
                  placeholder="Ej: Cuenta principal del club"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  variant="secondary"
                />
              </div>

              <div className="flex flex-row items-center justify-between p-4 bg-default-100 rounded-xl">
                <Switch isSelected={isDefault} onChange={setIsDefault}>
                  <Switch.Content>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        Cuenta por Defecto
                      </span>
                      <span className="text-xs text-default-500">
                        Se seleccionará automáticamente en nuevos cobros y pagos
                      </span>
                    </div>
                  </Switch.Content>
                </Switch>
              </div>

              {accountToEdit && (
                <div className="flex flex-row items-center justify-between p-4 bg-default-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Cuenta Activa</span>
                    <span className="text-xs text-default-500">
                      Si se desactiva, no podrá usarse en nuevas transacciones
                    </span>
                  </div>
                  <Switch isSelected={isActive} onChange={setIsActive} />
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-8">
              <Button variant="danger-soft" onPress={() => onOpenChange(false)}>
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
                Cancelar
              </Button>
              <Button
                variant="primary"
                isPending={isLoading}
                onPress={handleSubmit}
              >
                <HugeiconsIcon icon={FloppyDiskIcon} size={18} />
                {accountToEdit ? "Actualizar Cuenta" : "Crear Cuenta"}
              </Button>
            </div>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
