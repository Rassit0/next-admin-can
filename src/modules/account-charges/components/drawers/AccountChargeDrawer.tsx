"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Input,
  ComboBox,
  ListBox,
  Label,
  TextArea,
  TextField,
  Tabs,
  Switch,
} from "@heroui/react";
import { Cancel01Icon, FloppyDiskIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { IAccountCharge } from "../../interfaces/charge.interface";
import { createAccountCharge } from "../../actions/create";
import { updateAccountCharge } from "../../actions/update";
import {
  getAccountCategories,
  IAccountCategory,
} from "@/modules/account-categories";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  charge?: IAccountCharge | null;
  direction: "RECEIVABLE" | "PAYABLE";
  onSuccess?: () => void;
}

export const AccountChargeDrawer = ({
  isOpen,
  onOpenChange,
  charge,
  direction,
  onSuccess,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<IAccountCategory[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [isImmediate, setIsImmediate] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CASH");

  // Entity logic
  const [entityType, setEntityType] = useState<"EXTERNAL" | "PERSON">(
    "EXTERNAL",
  );
  const [externalEntity, setExternalEntity] = useState("");
  const [personId, setPersonId] = useState("");

  const isReceivable = direction === "RECEIVABLE";
  const drawerTitle = charge
    ? `Editar ${isReceivable ? "Cobro" : "Pago"}`
    : `Nuevo ${isReceivable ? "Cobro" : "Pago"}`;

  useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (charge) {
        setTitle(charge.title);
        setAmount(charge.charge?.amount.toString() || "");
        setDueDate(
          charge.charge?.dueDate
            ? new Date(charge.charge.dueDate).toISOString().split("T")[0]
            : "",
        );
        setCategoryId(charge.categoryId);
        setDescription(charge.description || "");
        setReferenceNumber(charge.referenceNumber || "");

        if (charge.personId) {
          setEntityType("PERSON");
          setPersonId(charge.personId);
        } else {
          setEntityType("EXTERNAL");
          setExternalEntity(charge.externalEntity || "");
        }
      } else {
        resetForm();
      }
    } else {
      resetForm();
    }
  }, [isOpen, charge]);

  const loadCategories = async () => {
    const res = await getAccountCategories({
      per_page: "100",
      type: direction,
    });
    if (!res.error) {
      setCategories(res.data?.data || []);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDueDate("");
    setCategoryId("");
    setDescription("");
    setReferenceNumber("");
    setEntityType("EXTERNAL");
    setExternalEntity("");
    setPersonId("");
    setIsImmediate(false);
    setPaymentMethod("CASH");
  };

  const handleSubmit = async () => {
    if (!title || !amount || !categoryId) {
      toast.error("Por favor complete los campos requeridos");
      return;
    }

    if (!isImmediate && !dueDate) {
      toast.error("Por favor ingrese la fecha de vencimiento");
      return;
    }

    if (entityType === "EXTERNAL" && !externalEntity) {
      toast.error("Por favor ingrese el nombre de la entidad");
      return;
    }

    if (entityType === "PERSON" && !personId) {
      toast.error("Por favor seleccione una persona"); // In a real app we'd have an autocomplete here
      return;
    }

    setIsLoading(true);
    try {
      if (charge) {
        // Update logic
        const data = {
          title,
          description: description || undefined,
          dueDate: new Date(dueDate).toISOString(),
          categoryId,
          referenceNumber: referenceNumber || undefined,
          externalEntity:
            entityType === "EXTERNAL" ? externalEntity : undefined,
          personId: entityType === "PERSON" ? personId : undefined,
        };
        const res = await updateAccountCharge(charge.id, data);
        if (res.error) toast.error(res.message);
        else {
          toast.success(res.message);
          onOpenChange(false);
          onSuccess?.();
        }
      } else {
        // Create logic
        const data = {
          title,
          amount: Number(amount),
          direction,
          categoryId,
          dueDate: isImmediate
            ? new Date().toISOString()
            : new Date(dueDate).toISOString(),
          description: description || undefined,
          referenceNumber: referenceNumber || undefined,
          externalEntity:
            entityType === "EXTERNAL" ? externalEntity : undefined,
          personId: entityType === "PERSON" ? personId : undefined,
          immediatePayment: isImmediate ? { paymentMethod } : undefined,
        };
        const res = await createAccountCharge(data);
        if (res.error) toast.error(res.message);
        else {
          toast.success(res.message);
          onOpenChange(false);
          onSuccess?.();
        }
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
              {drawerTitle}
            </Drawer.Heading>
          </Drawer.Header>
          <Drawer.Body className="gap-6 pt-6 pb-6">
            <TextField className="w-full" isRequired>
              <Label className="text-sm font-semibold">Título / Concepto</Label>
              <Input
                placeholder={`Ej. ${isReceivable ? "Cobro por alquiler" : "Pago de servicio eléctrico"}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="secondary"
              />
            </TextField>

            {!charge && (
              <TextField className="w-full" isRequired>
                <Label className="text-sm font-semibold">Monto</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  variant="secondary"
                />
              </TextField>
            )}

            {!charge && (
              <div className="flex items-center justify-between mt-2 mb-2 p-3 bg-default-100 rounded-xl">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold">
                    Liquidar Inmediatamente
                  </span>
                  <span className="text-xs text-default-500">
                    Registrar el pago automáticamente en caja
                  </span>
                </div>
                <Switch
                  isSelected={isImmediate}
                  onChange={setIsImmediate}
                  size="sm"
                />
              </div>
            )}

            {isImmediate && !charge ? (
              <ComboBox
                className="w-full"
                variant="secondary"
                selectedKey={paymentMethod}
                onSelectionChange={(key) => setPaymentMethod(String(key))}
                isRequired
              >
                <Label className="text-sm font-semibold">Método de Pago</Label>
                <ComboBox.InputGroup>
                  <Input variant="secondary" />
                  <ComboBox.Trigger />
                </ComboBox.InputGroup>
                <ComboBox.Popover>
                  <ListBox>
                    <ListBox.Item id="CASH" textValue="Efectivo">
                      Efectivo
                    </ListBox.Item>
                    <ListBox.Item
                      id="BANK_TRANSFER"
                      textValue="Transferencia Bancaria"
                    >
                      Transferencia Bancaria
                    </ListBox.Item>
                    <ListBox.Item id="QR" textValue="Pago QR">
                      Pago QR
                    </ListBox.Item>
                  </ListBox>
                </ComboBox.Popover>
              </ComboBox>
            ) : (
              <TextField className="w-full" isRequired={!isImmediate}>
                <Label className="text-sm font-semibold">
                  Fecha de Vencimiento
                </Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  variant="secondary"
                />
              </TextField>
            )}

            <ComboBox
              className="w-full"
              variant="secondary"
              menuTrigger="focus"
              selectedKey={categoryId}
              onSelectionChange={(key) => {
                if (key) setCategoryId(String(key));
              }}
              isRequired
            >
              <Label className="text-sm font-semibold">Categoría</Label>
              <ComboBox.InputGroup>
                <Input
                  variant="secondary"
                  placeholder="Seleccione una categoría"
                />
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

            <div className="flex flex-col gap-2">
              <span className="text-sm text-default-600 font-medium">
                Entidad asociada (
                {isReceivable ? "Cliente / Deudor" : "Proveedor / Acreedor"})
              </span>
              <Tabs
                selectedKey={entityType}
                onSelectionChange={(key) => setEntityType(key as any)}
                variant="secondary"
              >
                <Tabs.ListContainer>
                  <Tabs.List>
                    <Tabs.Tab id="EXTERNAL">
                      Entidad Externa
                      <Tabs.Indicator />
                    </Tabs.Tab>
                    <Tabs.Tab id="PERSON">
                      Persona Registrada
                      <Tabs.Indicator />
                    </Tabs.Tab>
                  </Tabs.List>
                </Tabs.ListContainer>

                <Tabs.Panel key="EXTERNAL" id="EXTERNAL">
                  <Input
                    placeholder="Nombre de la empresa o persona"
                    value={externalEntity}
                    onChange={(e) => setExternalEntity(e.target.value)}
                    variant="secondary"
                    className="mt-2"
                  />
                </Tabs.Panel>
                <Tabs.Panel key="PERSON" id="PERSON">
                  <Input
                    placeholder="ID de la persona (Temporalmente)"
                    value={personId}
                    onChange={(e) => setPersonId(e.target.value)}
                    variant="secondary"
                    className="mt-2"
                  />
                  <span className="text-xs text-default-400 mt-1 inline-block">
                    El selector avanzado de personas se implementará
                    próximamente.
                  </span>
                </Tabs.Panel>
              </Tabs>
            </div>

            <TextField className="w-full">
              <Label className="text-sm font-semibold">
                Número de Referencia
              </Label>
              <Input
                placeholder="Ej. Factura #12345"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                variant="secondary"
              />
            </TextField>

            <TextField className="w-full">
              <Label className="text-sm font-semibold">Descripción</Label>
              <TextArea
                placeholder="Detalles adicionales sobre este registro"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </TextField>
          </Drawer.Body>
          <Drawer.Footer className="border-t border-border">
            <Button variant="outline" onPress={() => onOpenChange(false)}>
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
