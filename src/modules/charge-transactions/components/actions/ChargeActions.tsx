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
import { addChargeAdjustment } from "../../actions/add-adjustment";
import { removeChargeAdjustment } from "../../actions/remove-adjustment";
import { updateCharge } from "../../actions/update";
import { removeCharge } from "../../actions/remove";
import { applyLateFee } from "../../actions/apply-late-fee";
import { previewLateFee, ILateFeePreview } from "../../actions/preview-late-fee";

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
  const [adjustmentAmount, setAdjustmentAmount] = useState(charge.adjustmentAmount ? charge.adjustmentAmount.toString() : "");
  const [adjustmentReason, setDiscountReason] = useState(charge.adjustmentReason || "");

  // State for Edit Charge form
  const [chargeDescription, setChargeDescription] = useState(charge.description);
  const [chargeAmount, setChargeAmount] = useState(charge.amount.toString());
  const [chargeDueDate, setChargeDueDate] = useState(
    charge.dueDate ? new Date(charge.dueDate).toISOString().split('T')[0] : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lateFeePreview, setLateFeePreview] = useState<ILateFeePreview | null>(null);
  const [customLateFeeAmount, setCustomLateFeeAmount] = useState<string>("");

  const hasAdjustment = Number(charge.adjustmentAmount) !== 0;
  
  const isManual = 
    charge.membershipCharges?.[0]?.type === 'MANUAL' || 
    charge.studentCharges?.[0]?.type === 'MANUAL';

  const isStudentCharge = charge.studentCharges && charge.studentCharges.length > 0;
  const isMembershipCharge = charge.membershipCharges && charge.membershipCharges.length > 0;
  const isLateFee = charge.studentCharges?.[0]?.type === 'LATE_FEE' || charge.membershipCharges?.[0]?.type === 'LATE_FEE';
  const isPastDue = new Date(charge.dueDate) < new Date();

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
  
  // A charge is fully paid with real money if the total paid amount equals or exceeds the charge amount
  // We use the actual payments data from the backend as the single source of truth for real money.
  const paidAmount = charge.payments
    ? charge.payments
        .filter((p) => p.status === "COMPLETED")
        .reduce((sum, p) => sum + Number(p.amount), 0)
    : (Number(charge.amount) + Number(charge.adjustmentAmount || 0)) - Number(charge.pendingAmount || 0);
  const isFullyPaidWithMoney = paidAmount >= Number(charge.amount);

  // We allow adding/editing discounts if the charge is not cancelled and not fully paid with money.
  if (charge.status !== "CANCELLED" && !isFullyPaidWithMoney) {
    allActions.push({
      key: "add-adjustment",
      label: hasAdjustment ? "Editar Ajuste (Descuento/Recargo)" : "Aplicar Ajuste (Descuento/Recargo)",
      icon: Tag01Icon,
    });
  }

  if ((isStudentCharge || isMembershipCharge) && !isLateFee && charge.status !== "CANCELLED") {
    allActions.push({
      key: "apply-late-fee",
      label: "Generar Mora",
      icon: Note01Icon,
    });
  }

  // We allow removing discount as long as it has a discount and is not cancelled.
  // (If it has a discount, it couldn't have been fully paid with money alone).
  if (hasAdjustment && charge.status !== "CANCELLED") {
    allActions.push({
      key: "remove-adjustment",
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
      
      if (key === "apply-late-fee") {
        setLoading(true);
        previewLateFee(charge.id, isMembershipCharge ? 'membership' : 'student').then((res) => {
          setLoading(false);
          if (res.error) {
            toast.error(res.message);
            return;
          }
          if (res.data?.alreadyHasLateFee) {
             toast.error("Este cargo ya tiene una mora generada que está pendiente de pago.");
             return;
          }
          setLateFeePreview(res.data!);
          setCustomLateFeeAmount(res.data!.totalLateFeeAmount.toString());
          confirmState.open();
        });
        return;
      }

      // Reset form on open
      if (key === "add-adjustment") {
        setAdjustmentAmount(charge.adjustmentAmount ? charge.adjustmentAmount.toString() : "");
        setDiscountReason(charge.adjustmentReason || "");
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

    if (action === "apply-late-fee") {
      const parsedAmount = Number(customLateFeeAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setErrors({ customLateFeeAmount: "El monto debe ser mayor a 0." });
        setLoading(false);
        return;
      }
      res = await applyLateFee(charge.id, isMembershipCharge ? 'membership' : 'student', parsedAmount);
    } else if (action === "remove-adjustment") {
      res = await removeChargeAdjustment(charge.id);
    } else if (action === "delete-charge") {
      res = await removeCharge(charge.id);
    } else if (action === "add-adjustment") {
      const amountNum = Number(adjustmentAmount);
      const chargeAmountNum = Number(charge.amount);
      
      if (amountNum < 0 && Math.abs(amountNum) > chargeAmountNum) {
        setErrors({ adjustmentAmount: "El monto del descuento no puede exceder el monto original del cargo." });
        setLoading(false);
        return;
      }
      
      if (!adjustmentReason.trim()) {
        setErrors({ adjustmentReason: "El motivo es obligatorio." });
        setLoading(false);
        return;
      }

      res = await addChargeAdjustment({
        id: charge.id,
        adjustmentAmount: amountNum,
        adjustmentReason,
      });
    } else if (action === "edit-charge") {
      const amountNum = Number(chargeAmount);
      const adjustmentNum = Number(charge.adjustmentAmount || 0);

      if (amountNum + adjustmentNum < 0) {
        setErrors({ chargeAmount: "El nuevo monto base sumado al ajuste no puede ser negativo." });
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
                {(selectedAction?.key === "remove-adjustment" || selectedAction?.key === "delete-charge") && (
                  <p>
                    {selectedAction?.key === "remove-adjustment" 
                      ? "¿Estás seguro de que deseas remover el descuento de este cargo? El saldo pendiente se ajustará automáticamente."
                      : "¿Estás seguro de que deseas eliminar este cargo manualmente? Esta acción no se puede deshacer."}
                  </p>
                )}

                {selectedAction?.key === "apply-late-fee" && lateFeePreview && (
                  <>
                    <p className="text-sm mb-2">
                      Estás a punto de aplicar una mora a este cargo vencido.
                    </p>
                    <div className="bg-surface-secondary p-3 rounded-lg flex flex-col gap-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monto Original:</span>
                        <span className="font-semibold">{lateFeePreview.originalAmount} Bs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Días transcurridos:</span>
                        <span className="font-semibold">{lateFeePreview.daysPassed} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Días de gracia permitidos:</span>
                        <span className="font-semibold">{lateFeePreview.graceDays} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Días sancionables:</span>
                        <span className="font-semibold text-danger">{lateFeePreview.punishableDays} días</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recargo por día:</span>
                        <span className="font-semibold">{lateFeePreview.lateFeePerDay} Bs</span>
                      </div>
                      <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-base items-center">
                        <span>Total Mora a Aplicar (Bs):</span>
                        <div className="w-1/3">
                          <TextField
                            name="customLateFeeAmount"
                            isRequired
                            isInvalid={!!errors.customLateFeeAmount || undefined}
                          >
                            <Input
                              variant="secondary"
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={customLateFeeAmount}
                              onChange={(e) => {
                                setCustomLateFeeAmount(e.target.value);
                                setErrors({});
                              }}
                            />
                            <FieldError children={errors.customLateFeeAmount && <> {errors.customLateFeeAmount}</>} />
                          </TextField>
                        </div>
                      </div>
                    </div>
                  </>
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

                {selectedAction?.key === "add-adjustment" && (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Monto Original del Cargo: <strong>{Number(charge.amount).toFixed(2)} Bs</strong>
                    </p>
                    
                    <TextField
                      name="adjustmentAmount"
                      isRequired
                      className="w-full"
                      isInvalid={!!errors.adjustmentAmount || undefined}
                    >
                      <Label>Monto (Bs) - Negativo para descuento, positivo para recargo</Label>
                      <Input
                        variant="secondary"
                        type="number"
                        step="0.01"
                        value={adjustmentAmount}
                        onChange={(e) => {
                          setAdjustmentAmount(e.target.value);
                          setErrors({});
                        }}
                        placeholder="0.00"
                      />
                      <FieldError children={errors.adjustmentAmount && <> {errors.adjustmentAmount}</>} />
                    </TextField>

                    <TextField 
                      name="adjustmentReason" 
                      className="w-full"
                      isRequired
                      isInvalid={!!errors.adjustmentReason || undefined}
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
                          value={adjustmentReason}
                          onChange={(e) => {
                            setDiscountReason(e.target.value);
                            setErrors({});
                          }}
                          placeholder="Ej. Beca, Hermano, etc."
                        />
                      </InputGroup>
                      <FieldError children={errors.adjustmentReason && <> {errors.adjustmentReason}</>} />
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
