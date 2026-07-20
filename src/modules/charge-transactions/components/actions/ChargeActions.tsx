"use client";
import {
  AlertDialog,
  Button,
  Dropdown,
  InputGroup,
  Label,
  TextField,
  useOverlayState,
  Input,
  FieldError,
} from "@heroui/react";
import { toast } from "sonner";
import {
  MoreVerticalSquare01Icon,
  Ticket01Icon,
  Tag01Icon,
  Logout01Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ICharge } from "../../interfaces/charges.interface";
import { addChargeDiscount } from "../../actions/add-discount";
import { removeChargeDiscount } from "../../actions/remove-discount";
import { updateCharge } from "../../actions/update";
import { removeCharge } from "../../actions/remove";

interface Props {
  charge: ICharge;
  onPay?: (charge: ICharge) => void;
  detailsHref?: string;
}

interface ActionDef {
  key: string;
  label: string;
  icon: typeof Ticket01Icon;
  danger?: boolean;
}

export const ChargeActions = ({ charge, onPay, detailsHref }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const confirmState = useOverlayState();
  const [selectedAction, setSelectedAction] = useState<ActionDef | null>(null);
  
  // State for Add Discount form
  const [discountAmount, setDiscountAmount] = useState(charge.discountAmount ? charge.discountAmount.toString() : "");
  const [discountReason, setDiscountReason] = useState(charge.discountReason || "");

  // State for Edit Charge form
  const [chargeDescription, setChargeDescription] = useState(charge.description);
  const [chargeAmount, setChargeAmount] = useState(charge.amount.toString());
  const [chargeDueDate, setChargeDueDate] = useState(
    charge.dueDate ? new Date(charge.dueDate).toISOString().split('T')[0] : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const hasDiscount = Number(charge.discountAmount) > 0;
  
  const isManual = 
    charge.membershipCharges?.[0]?.type === 'MANUAL' || 
    charge.studentCharges?.[0]?.type === 'MANUAL';

  const allActions: ActionDef[] = [];
  
  // Add payment action if pending or partial
  if (onPay && (charge.status === "PENDING" || charge.status === "PARTIAL")) {
    allActions.push({
      key: "pay",
      label: "Pagar",
      icon: Ticket01Icon,
    });
  }

  // Add details action if detailsHref is provided
  if (detailsHref) {
    allActions.push({
      key: "details",
      label: "Ver detalles",
      icon: MoreVerticalSquare01Icon, // Can use another icon like DocumentTextIcon, but we have limited imports here. Let's use Note01Icon.
    });
  }

  // Edit and Delete actions for MANUAL charges that are PENDING
  if (isManual && charge.status === "PENDING") {
    allActions.push({
      key: "edit-charge",
      label: "Editar Cargo",
      icon: Note01Icon,
    });
    allActions.push({
      key: "delete-charge",
      label: "Eliminar Cargo",
      icon: Logout01Icon,
      danger: true,
    });
  }
  
  // Only allow adding/editing discounts if the charge is not fully paid, or if we explicitly want to allow it anyway.
  // Generally, if it's PENDING or PARTIAL it can be discounted.
  if (charge.status !== "PAID" && charge.status !== "CANCELLED") {
    allActions.push({
      key: "add-discount",
      label: hasDiscount ? "Editar Descuento" : "Aplicar Descuento",
      icon: Tag01Icon,
    });
  }

  if (hasDiscount && charge.status !== "PAID") {
    allActions.push({
      key: "remove-discount",
      label: "Remover Descuento",
      icon: Logout01Icon,
      danger: true,
    });
  }

  const handleActionSelect = (key: string) => {
    if (key === "pay" && onPay) {
      onPay(charge);
      return;
    }
    
    if (key === "details" && detailsHref) {
      router.push(detailsHref);
      return;
    }

    const actionDef = allActions.find((a) => a.key === key);
    if (actionDef) {
      setSelectedAction(actionDef);
      
      // Reset form on open
      if (key === "add-discount") {
        setDiscountAmount(charge.discountAmount ? charge.discountAmount.toString() : "");
        setDiscountReason(charge.discountReason || "");
        setErrors({});
      } else if (key === "edit-charge") {
        setChargeDescription(charge.description);
        setChargeAmount(charge.amount.toString());
        setChargeDueDate(charge.dueDate ? new Date(charge.dueDate).toISOString().split('T')[0] : "");
        setErrors({});
      }
      
      confirmState.open();
    }
  };

  const executeAction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAction) return;

    setLoading(true);
    const action = selectedAction.key;

    let res;

    if (action === "remove-discount") {
      res = await removeChargeDiscount(charge.id);
    } else if (action === "delete-charge") {
      res = await removeCharge(charge.id);
    } else if (action === "add-discount") {
      const amountNum = Number(discountAmount);
      const chargeAmountNum = Number(charge.amount);
      
      if (amountNum <= 0 || amountNum > chargeAmountNum) {
        setErrors({ discountAmount: "El monto debe ser mayor a 0 y no exceder el monto original del cargo." });
        setLoading(false);
        return;
      }
      
      if (!discountReason.trim()) {
        setErrors({ discountReason: "El motivo es obligatorio." });
        setLoading(false);
        return;
      }

      res = await addChargeDiscount({
        id: charge.id,
        discountAmount: amountNum,
        discountReason,
      });
    } else if (action === "edit-charge") {
      const amountNum = Number(chargeAmount);
      const discountNum = Number(charge.discountAmount || 0);

      if (amountNum < discountNum) {
        setErrors({ chargeAmount: "El nuevo monto base no puede ser menor al descuento ya aplicado." });
        setLoading(false);
        return;
      }

      if (!chargeDescription.trim()) {
        setErrors({ chargeDescription: "El concepto es obligatorio." });
        setLoading(false);
        return;
      }

      if (!chargeDueDate) {
        setErrors({ chargeDueDate: "La fecha de vencimiento es obligatoria." });
        setLoading(false);
        return;
      }

      res = await updateCharge({
        id: charge.id,
        amount: amountNum,
        description: chargeDescription,
        dueDate: new Date(`${chargeDueDate}T00:00:00`).toISOString(),
      });
    }

    if (res?.error) {
      toast.error(res.message, { description: res.message });
      setLoading(false);
      return;
    }

    toast.success(res?.message, { description: res?.message });
    confirmState.close();
    setLoading(false);
    router.refresh();
  };

  if (allActions.length === 0) return null;

  return (
    <>
      <Dropdown>
        <Button
          aria-label="Acciones de cargo"
          isIconOnly
          size="sm"
          variant="ghost"
        >
          <HugeiconsIcon icon={MoreVerticalSquare01Icon} />
        </Button>
        <Dropdown.Popover>
          <Dropdown.Menu onAction={(key) => handleActionSelect(key as string)}>
            {allActions.map((action) => (
              <Dropdown.Item
                key={action.key}
                id={action.key}
                textValue={action.label}
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

      <AlertDialog.Backdrop
        isOpen={confirmState.isOpen}
        onOpenChange={confirmState.setOpen}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-md">
            <AlertDialog.CloseTrigger />
            <form
              onSubmit={executeAction}
              className="flex flex-col h-full w-full"
            >
              <AlertDialog.Header>
                <AlertDialog.Icon
                  status={selectedAction?.danger ? "danger" : "accent"}
                />
                <AlertDialog.Heading>
                  {selectedAction?.label}
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="gap-4 p-2">
                {(selectedAction?.key === "remove-discount" || selectedAction?.key === "delete-charge") && (
                  <p>
                    {selectedAction?.key === "remove-discount" 
                      ? "¿Estás seguro de que deseas remover el descuento de este cargo? El saldo pendiente se ajustará automáticamente."
                      : "¿Estás seguro de que deseas eliminar este cargo manualmente? Esta acción no se puede deshacer."}
                  </p>
                )}

                {selectedAction?.key === "edit-charge" && (
                  <>
                    <TextField
                      name="chargeDescription"
                      isRequired
                      className="w-full"
                      isInvalid={!!errors.chargeDescription || undefined}
                    >
                      <Label className="text-sm font-semibold">Concepto</Label>
                      <Input
                        variant="secondary"
                        value={chargeDescription}
                        onChange={(e) => {
                          setChargeDescription(e.target.value);
                          setErrors({});
                        }}
                        placeholder="Ej. Inscripción, Mensualidad..."
                      />
                      <FieldError children={errors.chargeDescription && <> {errors.chargeDescription}</>} />
                    </TextField>
                    
                    <TextField
                      name="chargeAmount"
                      isRequired
                      className="w-full"
                      isInvalid={!!errors.chargeAmount || undefined}
                    >
                      <Label className="text-sm font-semibold">Monto Base (Bs)</Label>
                      <Input
                        variant="secondary"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={chargeAmount}
                        onChange={(e) => {
                          setChargeAmount(e.target.value);
                          setErrors({});
                        }}
                        placeholder="0.00"
                      />
                      <FieldError children={errors.chargeAmount && <> {errors.chargeAmount}</>} />
                    </TextField>

                    <TextField 
                      name="chargeDueDate" 
                      className="w-full"
                      isRequired
                      isInvalid={!!errors.chargeDueDate || undefined}
                    >
                      <Label className="text-sm font-semibold">
                        Fecha de Vencimiento
                      </Label>
                      <Input
                        variant="secondary"
                        type="date"
                        value={chargeDueDate}
                        onChange={(e) => {
                          setChargeDueDate(e.target.value);
                          setErrors({});
                        }}
                      />
                      <FieldError children={errors.chargeDueDate && <> {errors.chargeDueDate}</>} />
                    </TextField>
                  </>
                )}

                {selectedAction?.key === "add-discount" && (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Monto Original del Cargo: <strong>{Number(charge.amount).toFixed(2)} Bs</strong>
                    </p>
                    
                    <TextField
                      name="discountAmount"
                      isRequired
                      className="w-full"
                      isInvalid={!!errors.discountAmount || undefined}
                    >
                      <Label className="text-sm font-semibold">Monto del Descuento (Bs)</Label>
                      <Input
                        variant="secondary"
                        type="number"
                        step="0.01"
                        min="0.01"
                        max={Number(charge.amount)}
                        value={discountAmount}
                        onChange={(e) => {
                          setDiscountAmount(e.target.value);
                          setErrors({});
                        }}
                        placeholder="0.00"
                      />
                      <FieldError children={errors.discountAmount && <> {errors.discountAmount}</>} />
                    </TextField>

                    <TextField 
                      name="discountReason" 
                      className="w-full"
                      isRequired
                      isInvalid={!!errors.discountReason || undefined}
                    >
                      <Label className="text-sm font-semibold">
                        Motivo u Observación
                      </Label>
                      <InputGroup>
                        <InputGroup.Prefix>
                          <HugeiconsIcon
                            icon={Note01Icon}
                            size={18}
                            className="text-muted-foreground"
                          />
                        </InputGroup.Prefix>
                        <Input
                          variant="secondary"
                          value={discountReason}
                          onChange={(e) => {
                            setDiscountReason(e.target.value);
                            setErrors({});
                          }}
                          placeholder="Ej. Beca, Hermano, etc."
                        />
                      </InputGroup>
                      <FieldError children={errors.discountReason && <> {errors.discountReason}</>} />
                    </TextField>
                  </>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  variant="tertiary"
                  onPress={confirmState.close}
                  isDisabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant={selectedAction?.danger ? "danger" : "primary"}
                  isPending={loading}
                >
                  Confirmar
                </Button>
              </AlertDialog.Footer>
            </form>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
};
