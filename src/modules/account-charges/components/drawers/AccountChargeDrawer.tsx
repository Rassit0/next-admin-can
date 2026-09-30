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
  Autocomplete,
  SearchField,
  Spinner,
  cn,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { IPersonOption } from "@/modules/persons";
import { CounterpartySelector, CounterpartyType } from "@/modules/accounting-cash-flow/components/form/CounterpartySelector";
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
  defaultPerson?: IPersonOption | null;
}

export const AccountChargeDrawer = ({
  isOpen,
  onOpenChange,
  charge,
  direction,
  onSuccess,
  defaultPerson,
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
  const [counterpartyType, setCounterpartyType] = useState<CounterpartyType | null>("PERSON");
  const [personId, setPersonId] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

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
          setCounterpartyType("PERSON");
          setPersonId(charge.personId);
        } else if (charge.companyId) {
          setCounterpartyType("COMPANY");
          setCompanyId(charge.companyId);
        } else {
          setCounterpartyType(null);
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
      excludeSystem: "true",
    });
    if (!res.error) {
      setCategories(res.data?.data || []);
    }
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setDueDate(new Date().toISOString().split("T")[0]);
    setCategoryId("");
    setDescription("");
    setReferenceNumber("");

    if (defaultPerson) {
      setCounterpartyType("PERSON");
      setPersonId(defaultPerson.id);
    } else {
      setCounterpartyType("PERSON");
      setPersonId(null);
      setCompanyId(null);
    }

    setIsImmediate(false);
    setPaymentMethod("CASH");
  };

  const handleSubmit = async () => {
    if (!title || !amount || !categoryId) {
      toast.error("Por favor complete los campos requeridos");
      return;
    }

    if (!isImmediate && !dueDate && !defaultPerson) {
      toast.error("Por favor ingrese la fecha de vencimiento");
      return;
    }

    if (!personId && !companyId) {
      toast.error("Por favor seleccione una persona o empresa");
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
          personId: personId || undefined,
          companyId: companyId || undefined,
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
            : dueDate
              ? new Date(dueDate).toISOString()
              : new Date().toISOString(),
          description: description || undefined,
          referenceNumber: referenceNumber || undefined,
          personId: personId || undefined,
          companyId: companyId || undefined,
          immediatePayment: isImmediate
            ? {
                paymentMethod,
                payerPersonId: personId || undefined,
                payerCompanyId: companyId || undefined,
              }
            : undefined,
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
      toast.error("Ocurró un error inesperado");
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

            {isImmediate && !charge && (
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
            )}

            {!defaultPerson && (!isImmediate || charge) && (
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
              <CounterpartySelector
                label="Beneficiario / Responsable"
                counterpartyType={counterpartyType}
                setCounterpartyType={setCounterpartyType}
                personId={personId}
                setPersonId={setPersonId}
                companyId={companyId}
                setCompanyId={setCompanyId}
                defaultPerson={defaultPerson}
                allowNone
                isRequired={false}
              />
            </div>

            {!defaultPerson && (
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
            )}

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
