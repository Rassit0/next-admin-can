"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Input,
  ComboBox,
  ListBox,
  Label,
  TextField,
} from "@heroui/react";
import { Cancel01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { createAccountCharge } from "@/modules/account-charges/actions/create";
import { useRouter } from "next/navigation";

import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  type: "INCOME" | "EXPENSE";
  categories: Array<{ id: string; name: string }>;
  financialAccounts: FinancialAccount[];
  onSuccess?: () => void;
}

export const DirectTransactionDrawer = ({
  isOpen,
  onOpenChange,
  type,
  categories,
  financialAccounts,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [financialAccountId, setFinancialAccountId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setConcept("");
      setAmount("");
      setCategoryId("");
      setFinancialAccountId("");
      setPaymentMethod("CASH");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!concept || !amount || !categoryId || !paymentMethod || !financialAccountId) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    setIsLoading(true);
    try {
      // Creamos un AccountCharge pero forzando el pago inmediato
      const res = await createAccountCharge({
        title: concept,
        amount: Number(amount),
        direction: type === "INCOME" ? "RECEIVABLE" : "PAYABLE",
        categoryId,
        dueDate: new Date().toISOString(),
        immediatePayment: {
          paymentMethod,
          financialAccountId,
        },
      });

      if (res.error) {
        toast.error(res.message);
      } else {
        toast.success("Movimiento registrado exitosamente");
        // Refrescar lista de transacciones
        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog className="w-full sm:max-w-md">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border">
            <Drawer.Heading className="text-lg font-bold">
              {type === "INCOME" ? "Registrar Ingreso Directo" : "Registrar Gasto Directo"}
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="gap-6 pt-6">
            <TextField className="w-full" isRequired>
              <Label className="text-sm font-semibold">Concepto</Label>
              <Input
                placeholder={type === "INCOME" ? "Ej. Venta de material" : "Ej. Compra de limpieza"}
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                variant="secondary"
              />
            </TextField>

            <TextField className="w-full" isRequired>
              <Label className="text-sm font-semibold">Monto (Bs)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="secondary"
              />
            </TextField>

            <ComboBox
              className="w-full"
              variant="secondary"
              menuTrigger="focus"
              selectedKey={categoryId}
              onSelectionChange={(key) => {
                if (key) setCategoryId(key as string);
              }}
              isRequired
            >
              <Label className="text-sm font-semibold">Categoría</Label>
              <ComboBox.InputGroup>
                <Input variant="secondary" placeholder="Seleccione una categoría" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  {categories.map((cat) => (
                    <ListBox.Item key={cat.id} id={cat.id} textValue={cat.name}>
                      {cat.name}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>

            <ComboBox
              className="w-full"
              variant="secondary"
              menuTrigger="focus"
              selectedKey={paymentMethod}
              onSelectionChange={(key) => {
                if (key) setPaymentMethod(key as string);
              }}
              isRequired
            >
              <Label className="text-sm font-semibold">Método de Pago</Label>
              <ComboBox.InputGroup>
                <Input variant="secondary" placeholder="Seleccione el método de pago" />
                <ComboBox.Trigger />
              </ComboBox.InputGroup>
              <ComboBox.Popover>
                <ListBox>
                  <ListBox.Item id="CASH" textValue="Efectivo">
                    Efectivo
                  </ListBox.Item>
                  <ListBox.Item id="TRANSFER" textValue="Transferencia">
                    Transferencia Bancaria
                  </ListBox.Item>
                  <ListBox.Item id="QR" textValue="Código QR">
                    Código QR
                  </ListBox.Item>
                </ListBox>
              </ComboBox.Popover>
            </ComboBox>
              <ComboBox
                className="w-full"
                variant="secondary"
                aria-label="Seleccionar cuenta financiera"
                menuTrigger="focus"
                selectedKey={financialAccountId}
                onSelectionChange={(key) => {
                  if (key) setFinancialAccountId(key as string);
                }}
                isRequired
              >
                <Label className="mb-1 text-sm font-semibold">
                  Cuenta Financiera
                </Label>
                <ComboBox.InputGroup>
                  <Input variant="secondary" placeholder="Seleccione cuenta" />
                  <ComboBox.Trigger />
                </ComboBox.InputGroup>
                <ComboBox.Popover>
                  <ListBox items={financialAccounts}>
                    {(item: FinancialAccount) => (
                      <ListBox.Item key={item.id} id={item.id} textValue={item.name}>
                        <div className="flex flex-col">
                          <span className="text-small">{item.name}</span>
                          <span className="text-tiny text-default-400">
                            {item.type} • {item.currency}
                          </span>
                        </div>
                      </ListBox.Item>
                    )}
                  </ListBox>
                </ComboBox.Popover>
              </ComboBox>
            
          </Drawer.Body>
          <Drawer.Footer className="border-t border-border">
            <Button
              variant="outline"
              onPress={() => onOpenChange(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
              Cancelar
            </Button>
            <Button
              variant="primary"
              onPress={handleSubmit}
              isDisabled={isLoading}
            >
              {!isLoading && <HugeiconsIcon icon={FloppyDiskIcon} size={18} />}
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </Drawer.Footer>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
