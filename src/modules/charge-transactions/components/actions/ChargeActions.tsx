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
  Ticket02Icon,
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
import { updateChargeDueDate } from "../../actions/update-charge-due-date";
import { applyLateFee } from "../../actions/apply-late-fee";
import {
  previewLateFee,
  ILateFeePreview,
} from "../../actions/preview-late-fee";
import { CancelCycleModal } from "@/modules/student-memberships/components/modal/CancelCycleModal";
import { cancelCycleEnrollmentAction } from "@/modules/student-memberships/actions/cancel-cycle";
import { usePermissions } from "@/shared/providers/PermissionsProvider";

interface Props {
  charge: ICharge;
  onPay?: (charge: ICharge) => void;
  detailsHref?: string;
  onSuccess?: () => void;
}

interface ActionDef {
  key: string;
  label: string;
  icon: typeof Ticket01Icon;
  danger?: boolean;
}

export const ChargeActions = ({
  charge,
  onPay,
  detailsHref,
  onSuccess,
}: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const confirmState = useOverlayState();
  const [selectedAction, setSelectedAction] = useState<ActionDef | null>(null);

  // Permisos funcionales para ciclo de estudiante
  let permissions: string[] = [];
  try {
    permissions = usePermissions() || [];
  } catch {
    permissions = [];
  }
  const canCancelCycle =
    permissions.includes("UPDATE_STUDENT_MEMBERSHIPS") ||
    permissions.includes("DELETE_STUDENT_MEMBERSHIPS");

  // Modal para cancelar ciclo directamente desde el cargo
  const [cancelCycleOpen, setCancelCycleOpen] = useState(false);
  // Propósito cuando un ajuste reduce el saldo a cero en ciclo PENDING ('CONFIRM' | 'CANCEL' | null)
  const [zeroBalanceIntent, setZeroBalanceIntent] = useState<
    "CONFIRM" | "CANCEL" | null
  >(null);

  // State for Add Discount form
  const [adjustmentAmount, setAdjustmentAmount] = useState(
    charge.adjustmentAmount ? charge.adjustmentAmount.toString() : "",
  );
  const [adjustmentReason, setDiscountReason] = useState(
    charge.adjustmentReason || "",
  );

  // State for Edit Charge form
  const [chargeDescription, setChargeDescription] = useState(
    charge.description,
  );
  const [chargeAmount, setChargeAmount] = useState(charge.amount.toString());
  const [chargeDueDate, setChargeDueDate] = useState(
    charge.dueDate ? new Date(charge.dueDate).toISOString().split("T")[0] : "",
  );

  const [updateDueDateValue, setUpdateDueDateValue] = useState(
    charge.dueDate ? new Date(charge.dueDate).toISOString().split("T")[0] : "",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lateFeePreview, setLateFeePreview] = useState<ILateFeePreview | null>(
    null,
  );
  const [customLateFeeAmount, setCustomLateFeeAmount] = useState<string>("");

  const hasAdjustment = Number(charge.adjustmentAmount) !== 0;

  const isManual =
    charge.membershipCharges?.[0]?.type === "MANUAL" ||
    charge.studentCharges?.[0]?.type === "MANUAL" ||
    !!charge.accountCharge;

  const isStudentCharge =
    charge.studentCharges && charge.studentCharges.length > 0;
  const isMembershipCharge =
    charge.membershipCharges && charge.membershipCharges.length > 0;
  const isLateFee =
    charge.studentCharges?.[0]?.type === "LATE_FEE" ||
    charge.membershipCharges?.[0]?.type === "LATE_FEE";
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
    : Number(charge.amount) +
      Number(charge.adjustmentAmount || 0) -
      Number(charge.pendingAmount || 0);
  const isFullyPaidWithMoney = paidAmount >= Number(charge.amount);

  // We allow adding/editing discounts if the charge is not cancelled and not fully paid with money.
  if (charge.status !== "CANCELLED" && !isFullyPaidWithMoney) {
    allActions.push({
      key: "add-adjustment",
      label: hasAdjustment
        ? "Editar Ajuste (Descuento/Recargo)"
        : "Aplicar Ajuste (Descuento/Recargo)",
      icon: Tag01Icon,
    });
  }

  if (charge.status !== "CANCELLED") {
    allActions.push({
      key: "update-due-date",
      label: "Modificar Fecha Vencimiento",
      icon: Note01Icon,
    });
  }

  if (
    (isStudentCharge || isMembershipCharge) &&
    !isLateFee &&
    charge.status !== "CANCELLED"
  ) {
    allActions.push({
      key: "apply-late-fee",
      label: "Generar Mora",
      icon: Note01Icon,
    });
  }

  // We allow removing adjustment as long as it has an adjustment and is not cancelled.
  // (If it has an adjustment, it couldn't have been fully paid with money alone).
  if (hasAdjustment && charge.status !== "CANCELLED") {
    allActions.push({
      key: "remove-adjustment",
      label: "Remover Ajuste",
      icon: Ticket02Icon,
      danger: true,
    });
  }

  // Check if there are completed or processing payments
  const hasPaymentsOrProcessing = charge.payments
    ? charge.payments.some(
        (p) =>
          (p.status === "COMPLETED" || p.status === "PROCESSING") &&
          Number(p.amount) > 0,
      )
    : paidAmount > 0;

  // Cancel cycle and charge if linked to a cancelable pending cycle without payments and user has required permission
  const isCancelableCycle =
    canCancelCycle &&
    !!charge.cycleEnrollment &&
    charge.cycleEnrollment.status === "PENDING" &&
    charge.status === "PENDING" &&
    !hasPaymentsOrProcessing &&
    paidAmount === 0;

  if (isCancelableCycle) {
    allActions.push({
      key: "cancel-cycle-charge",
      label: "Cancelar cargo e inscripción",
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

    if (key === "cancel-cycle-charge") {
      setCancelCycleOpen(true);
      return;
    }

    const actionDef = allActions.find((a) => a.key === key);
    if (actionDef) {
      setSelectedAction(actionDef);

      if (key === "apply-late-fee") {
        setLoading(true);
        previewLateFee(
          charge.id,
          isMembershipCharge ? "membership" : "student",
        ).then((res) => {
          setLoading(false);
          if (res.error) {
            toast.error(res.message);
            return;
          }
          if (res.data?.alreadyHasLateFee) {
            toast.error(
              "Este cargo ya tiene una mora generada que está pendiente de pago.",
            );
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
        setAdjustmentAmount(
          charge.adjustmentAmount ? charge.adjustmentAmount.toString() : "",
        );
        setDiscountReason(charge.adjustmentReason || "");
        setZeroBalanceIntent(null);
        setErrors({});
      } else if (key === "edit-charge") {
        setChargeDescription(charge.description);
        setChargeAmount(charge.amount.toString());
        setChargeDueDate(
          charge.dueDate
            ? new Date(charge.dueDate).toISOString().split("T")[0]
            : "",
        );
        setErrors({});
      } else if (key === "update-due-date") {
        setUpdateDueDateValue(
          charge.dueDate
            ? new Date(charge.dueDate).toISOString().split("T")[0]
            : "",
        );
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
      res = await applyLateFee(
        charge.id,
        isMembershipCharge ? "membership" : "student",
        parsedAmount,
      );
    } else if (action === "remove-adjustment") {
      res = await removeChargeAdjustment(charge.id);
    } else if (action === "delete-charge") {
      res = await removeCharge(charge.id);
    } else if (action === "add-adjustment") {
      const amountNum = Number(adjustmentAmount);
      const chargeAmountNum = Number(charge.amount);

      if (isNaN(amountNum) || adjustmentAmount === "") {
        setErrors({ adjustmentAmount: "Monto inválido." });
        setLoading(false);
        return;
      }

      if (amountNum < 0 && Math.abs(amountNum) > chargeAmountNum) {
        setErrors({
          adjustmentAmount:
            "El monto del ajuste (si es descuento) no puede exceder el monto original del cargo.",
        });
        setLoading(false);
        return;
      }

      if (!adjustmentReason.trim()) {
        setErrors({ adjustmentReason: "El motivo es obligatorio." });
        setLoading(false);
        return;
      }

      // Comprobación de saldo cero en ciclos PENDING
      const isCyclePending =
        charge.cycleEnrollment && charge.cycleEnrollment.status === "PENDING";
      const isZeroBalance = chargeAmountNum + amountNum <= 0;

      if (isCyclePending && isZeroBalance) {
        if (!zeroBalanceIntent) {
          setErrors({
            zeroBalanceIntent:
              "Debes seleccionar una opción: Mantener inscripción (Descuento total autorizado) o Cancelar inscripción y cargo.",
          });
          setLoading(false);
          return;
        }

        if (zeroBalanceIntent === "CANCEL") {
          if (!canCancelCycle) {
            setErrors({
              zeroBalanceIntent:
                "No tienes permisos para cancelar inscripciones de estudiantes.",
            });
            setLoading(false);
            return;
          }
          if (adjustmentReason.trim().length < 5) {
            setErrors({
              adjustmentReason:
                "El motivo de cancelación debe tener al menos 5 caracteres.",
            });
            setLoading(false);
            return;
          }
          // Opción 2: Cancelación de ciclo canónica
          res = await cancelCycleEnrollmentAction(charge.cycleEnrollment!.id, {
            reason: adjustmentReason.trim(),
          });
        } else {
          if (adjustmentReason.trim().length < 5) {
            setErrors({
              adjustmentReason:
                "El motivo o justificación de la autorización debe tener al menos 5 caracteres.",
            });
            setLoading(false);
            return;
          }
          // Opción 1: Mantener inscripción — Descuento total autorizado
          res = await addChargeAdjustment({
            id: charge.id,
            adjustmentAmount: amountNum,
            adjustmentReason: adjustmentReason.trim(),
            isScholarship: true,
          });
        }
      } else {
        res = await addChargeAdjustment({
          id: charge.id,
          adjustmentAmount: amountNum,
          adjustmentReason: adjustmentReason.trim(),
        });
      }
    } else if (action === "edit-charge") {
      const amountNum = Number(chargeAmount);
      const adjustmentNum = Number(charge.adjustmentAmount || 0);

      if (amountNum + adjustmentNum < 0) {
        setErrors({
          chargeAmount:
            "El nuevo monto base sumado al ajuste no puede ser negativo.",
        });
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
    } else if (action === "update-due-date") {
      if (!updateDueDateValue) {
        setErrors({
          updateDueDateValue: "La fecha de vencimiento es obligatoria.",
        });
        setLoading(false);
        return;
      }

      const tz = process.env.NEXT_PUBLIC_APP_TIMEZONE || "America/La_Paz";
      const safeDate = new Date(`${updateDueDateValue}T12:00:00Z`);
      const tzDate = new Date(
        safeDate.toLocaleString("en-US", { timeZone: tz }),
      );
      const utcDate = new Date(
        safeDate.toLocaleString("en-US", { timeZone: "UTC" }),
      );
      const offsetMinutes = Math.round(
        (utcDate.getTime() - tzDate.getTime()) / 60000,
      );

      const localMidnightUTC = new Date(`${updateDueDateValue}T00:00:00Z`);
      localMidnightUTC.setUTCMinutes(
        localMidnightUTC.getUTCMinutes() + offsetMinutes,
      );

      res = await updateChargeDueDate({
        id: charge.id,
        dueDate: localMidnightUTC.toISOString(),
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
    if (onSuccess) onSuccess();
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
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
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
                {(selectedAction?.key === "remove-adjustment" ||
                  selectedAction?.key === "delete-charge") && (
                  <p>
                    {selectedAction?.key === "remove-adjustment"
                      ? "¿Estás seguro de que deseas remover el ajuste de este cargo? El saldo pendiente se actualizará automáticamente."
                      : "¿Estás seguro de que deseas eliminar este cargo permanentemente? Esta acción no se puede deshacer."}
                  </p>
                )}

                {selectedAction?.key === "apply-late-fee" && lateFeePreview && (
                  <>
                    <p className="text-sm mb-2">
                      Estás a punto de aplicar una mora a este cargo vencido.
                    </p>
                    <div className="bg-surface-secondary p-3 rounded-lg flex flex-col gap-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Monto Original:
                        </span>
                        <span className="font-semibold">
                          {lateFeePreview.originalAmount} Bs
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dí­as transcurridos:
                        </span>
                        <span className="font-semibold">
                          {lateFeePreview.daysPassed} dí­as
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dí­as de gracia permitidos:
                        </span>
                        <span className="font-semibold">
                          {lateFeePreview.graceDays} dí­as
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Dí­as sancionables:
                        </span>
                        <span className="font-semibold text-danger">
                          {lateFeePreview.punishableDays} dí­as
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Recargo por dí­a:
                        </span>
                        <span className="font-semibold">
                          {lateFeePreview.lateFeePerDay} Bs
                        </span>
                      </div>
                      <div className="border-t border-border mt-2 pt-2 flex justify-between font-bold text-base items-center">
                        <span>Total Mora a Aplicar (Bs):</span>
                        <div className="w-1/3">
                          <TextField
                            name="customLateFeeAmount"
                            isRequired
                            isInvalid={
                              !!errors.customLateFeeAmount || undefined
                            }
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
                            <FieldError
                              children={
                                errors.customLateFeeAmount && (
                                  <> {errors.customLateFeeAmount}</>
                                )
                              }
                            />
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
                      <FieldError
                        children={
                          errors.chargeDescription && (
                            <> {errors.chargeDescription}</>
                          )
                        }
                      />
                    </TextField>

                    <TextField
                      name="chargeAmount"
                      isRequired
                      className="w-full"
                      isInvalid={!!errors.chargeAmount || undefined}
                    >
                      <Label className="text-sm font-semibold">
                        Monto Base (Bs)
                      </Label>
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
                      <FieldError
                        children={
                          errors.chargeAmount && <> {errors.chargeAmount}</>
                        }
                      />
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
                      <FieldError
                        children={
                          errors.chargeDueDate && <> {errors.chargeDueDate}</>
                        }
                      />
                    </TextField>
                  </>
                )}

                {selectedAction?.key === "update-due-date" && (
                  <>
                    <p className="text-sm mb-4">
                      Modificar la fecha de vencimiento de este cargo no
                      afectará su estado contable.
                    </p>
                    <TextField
                      name="updateDueDateValue"
                      className="w-full"
                      isRequired
                      isInvalid={!!errors.updateDueDateValue || undefined}
                    >
                      <Label className="text-sm font-semibold">
                        Nueva Fecha de Vencimiento
                      </Label>
                      <Input
                        variant="secondary"
                        type="date"
                        value={updateDueDateValue}
                        onChange={(e) => {
                          setUpdateDueDateValue(e.target.value);
                          setErrors({});
                        }}
                      />
                      <FieldError
                        children={
                          errors.updateDueDateValue && (
                            <> {errors.updateDueDateValue}</>
                          )
                        }
                      />
                    </TextField>
                  </>
                )}

                {selectedAction?.key === "add-adjustment" && (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Monto Original del Cargo:{" "}
                      <strong>{Number(charge.amount).toFixed(2)} Bs</strong>
                    </p>

                    <TextField
                      name="adjustmentAmount"
                      isRequired
                      className="w-full"
                      isInvalid={!!errors.adjustmentAmount || undefined}
                    >
                      <Label>
                        Monto (Bs) - Negativo para descuento, positivo para
                        recargo
                      </Label>
                      <Input
                        variant="secondary"
                        type="text"
                        inputMode="text"
                        value={adjustmentAmount}
                        onChange={(e) => {
                          // Permitir números, punto y signo menos
                          const val = e.target.value.replace(/[^0-9.-]/g, "");
                          setAdjustmentAmount(val);
                          setErrors({});
                        }}
                        placeholder="0.00"
                      />
                      <FieldError
                        children={
                          errors.adjustmentAmount && (
                            <> {errors.adjustmentAmount}</>
                          )
                        }
                      />
                    </TextField>

                    {/* Intercepción de saldo cero en ciclos pendientes */}
                    {charge.cycleEnrollment &&
                      charge.cycleEnrollment.status === "PENDING" &&
                      !isNaN(Number(adjustmentAmount)) &&
                      Number(charge.amount) + Number(adjustmentAmount) <= 0 &&
                      Number(adjustmentAmount) !== 0 && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg flex flex-col gap-2.5 text-xs">
                          <div className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                            <HugeiconsIcon icon={Note01Icon} size={16} />
                            Este ajuste reduce el saldo exigible a cero (Bs 0.00)
                          </div>
                          <p className="text-amber-700 dark:text-amber-300 text-[11px] leading-relaxed">
                            Este cargo pertenece a un ciclo escolar pendiente. Seleccione el propósito de la operación para mantener la integridad de inscripción y cupo:
                          </p>

                          <div className="flex flex-col gap-2.5 mt-0.5">
                            {/* Opción 1: Mantener inscripción — Descuento total autorizado */}
                            <div
                              onClick={() => {
                                setZeroBalanceIntent("CONFIRM");
                                setErrors({});
                              }}
                              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                                zeroBalanceIntent === "CONFIRM"
                                  ? "border-primary-500 bg-primary-50/90 dark:bg-primary-950/40 text-primary-950 dark:text-primary-100 shadow-xs"
                                  : "border-default-200 hover:bg-default-100/70"
                              }`}
                            >
                              <div className="font-semibold flex items-center gap-2 text-sm text-primary-700 dark:text-primary-300">
                                <input
                                  type="radio"
                                  name="zeroBalanceIntent"
                                  checked={zeroBalanceIntent === "CONFIRM"}
                                  onChange={() => {
                                    setZeroBalanceIntent("CONFIRM");
                                    setErrors({});
                                  }}
                                  className="accent-primary h-4 w-4"
                                />
                                OPCIÓN 1 — Mantener y confirmar inscripción
                              </div>
                              <div className="text-xs text-default-600 dark:text-default-400 ml-6 mt-1 leading-relaxed">
                                El estudiante continuará inscrito y podrá asistir. El cargo quedará liquidado mediante un descuento total autorizado.
                              </div>
                              <div className="flex flex-wrap gap-1.5 ml-6 mt-2 text-[10px] text-default-500">
                                <span className="bg-default-200/60 dark:bg-default-800/60 px-2 py-0.5 rounded">
                                  Conserva el cupo en el turno
                                </span>
                                <span className="bg-default-200/60 dark:bg-default-800/60 px-2 py-0.5 rounded">
                                  Cargo: PAGADO (bonificación)
                                </span>
                                <span className="bg-default-200/60 dark:bg-default-800/60 px-2 py-0.5 rounded">
                                  Ciclo: CONFIRMADO
                                </span>
                              </div>
                            </div>

                            {/* Opción 2: Cancelar inscripción y cargo */}
                            <div
                              onClick={() => {
                                setZeroBalanceIntent("CANCEL");
                                setErrors({});
                              }}
                              className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                                zeroBalanceIntent === "CANCEL"
                                  ? "border-danger-500 bg-danger-50/90 dark:bg-danger-950/40 text-danger-950 dark:text-danger-100 shadow-xs"
                                  : "border-default-200 hover:bg-default-100/70"
                              }`}
                            >
                              <div className="font-semibold flex items-center gap-2 text-sm text-danger-700 dark:text-danger-300">
                                <input
                                  type="radio"
                                  name="zeroBalanceIntent"
                                  checked={zeroBalanceIntent === "CANCEL"}
                                  onChange={() => {
                                    setZeroBalanceIntent("CANCEL");
                                    setErrors({});
                                  }}
                                  className="accent-danger h-4 w-4"
                                />
                                OPCIÓN 2 — Cancelar inscripción y cargo
                              </div>
                              <div className="text-xs text-default-600 dark:text-default-400 ml-6 mt-1 leading-relaxed">
                                Se cancelará el ciclo, se liberará el cupo y la deuda quedará anulada.
                              </div>
                              <div className="flex flex-wrap gap-1.5 ml-6 mt-2 text-[10px] text-default-500">
                                <span className="bg-default-200/60 dark:bg-default-800/60 px-2 py-0.5 rounded">
                                  Libera el cupo inmediatamente
                                </span>
                                <span className="bg-default-200/60 dark:bg-default-800/60 px-2 py-0.5 rounded">
                                  Cargo y ciclo: CANCELADOS
                                </span>
                                <span className="bg-default-200/60 dark:bg-default-800/60 px-2 py-0.5 rounded">
                                  Permite reinscripción (intento + 1)
                                </span>
                              </div>
                              {!canCancelCycle && (
                                <div className="text-[11px] text-danger-600 dark:text-danger-400 ml-6 mt-1 font-medium">
                                  ⚠️ No tienes permisos para cancelar inscripciones de estudiantes.
                                </div>
                              )}
                            </div>
                          </div>

                          {errors.zeroBalanceIntent && (
                            <span className="text-danger font-semibold text-xs mt-1">
                              {errors.zeroBalanceIntent}
                            </span>
                          )}
                        </div>
                      )}

                    <TextField
                      name="adjustmentReason"
                      className="w-full"
                      isRequired
                      isInvalid={!!errors.adjustmentReason || undefined}
                    >
                      <Label className="text-sm font-semibold">
                        {charge.cycleEnrollment &&
                        charge.cycleEnrollment.status === "PENDING" &&
                        !isNaN(Number(adjustmentAmount)) &&
                        Number(charge.amount) + Number(adjustmentAmount) <= 0 &&
                        Number(adjustmentAmount) !== 0
                          ? zeroBalanceIntent === "CANCEL"
                            ? "Motivo obligatorio de cancelación"
                            : "Motivo obligatorio de autorización (Descuento total)"
                          : "Motivo u Observación"}
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
                          placeholder={
                            charge.cycleEnrollment &&
                            charge.cycleEnrollment.status === "PENDING" &&
                            !isNaN(Number(adjustmentAmount)) &&
                            Number(charge.amount) + Number(adjustmentAmount) <= 0 &&
                            Number(adjustmentAmount) !== 0
                              ? zeroBalanceIntent === "CANCEL"
                                ? "Ej. Error administrativo, desistimiento del apoderado..."
                                : "Ej. Autorizado por Gerencia General, Beca deportiva, Convenio institucional..."
                              : "Ej. Autorizado por dirección, recargo por mora..."
                          }
                        />
                      </InputGroup>
                      <FieldError
                        children={
                          errors.adjustmentReason && (
                            <> {errors.adjustmentReason}</>
                          )
                        }
                      />
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
                  variant={
                    selectedAction?.key === "add-adjustment" &&
                    zeroBalanceIntent === "CANCEL"
                      ? "danger"
                      : selectedAction?.danger
                        ? "danger"
                        : "primary"
                  }
                  isPending={loading}
                >
                  {selectedAction?.key === "add-adjustment" &&
                  charge.cycleEnrollment?.status === "PENDING" &&
                  !isNaN(Number(adjustmentAmount)) &&
                  Number(charge.amount) + Number(adjustmentAmount) <= 0 &&
                  Number(adjustmentAmount) !== 0
                    ? zeroBalanceIntent === "CANCEL"
                      ? "Confirmar cancelación de ciclo"
                      : zeroBalanceIntent === "CONFIRM"
                        ? "Confirmar descuento total"
                        : "Confirmar ajuste"
                    : "Confirmar"}
                </Button>
              </AlertDialog.Footer>
            </form>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>

      <CancelCycleModal
        isOpen={cancelCycleOpen}
        onOpenChange={setCancelCycleOpen}
        cycle={
          charge.cycleEnrollment
            ? {
                id: charge.cycleEnrollment.id,
                studentName:
                  charge.studentCharges?.[0]?.studentMembership?.student?.person
                    ? `${charge.studentCharges[0].studentMembership.student.person.name} ${charge.studentCharges[0].studentMembership.student.person.lastName || ""}`.trim()
                    : (charge.cycleEnrollment as any)?.studentMembership?.student?.person
                      ? `${(charge.cycleEnrollment as any).studentMembership.student.person.name} ${(charge.cycleEnrollment as any).studentMembership.student.person.lastName || ""}`.trim()
                      : undefined,
                courseName:
                  charge.cycleEnrollment.courseSeason?.course?.name ||
                  (charge.studentCharges?.[0]?.studentMembership as any)?.courseSeason?.course?.name,
                shiftName:
                  charge.cycleEnrollment.courseSeasonShift?.shift?.name ||
                  (charge.studentCharges?.[0]?.studentMembership as any)?.courseSeasonShift?.shift?.name,
                cycleStartDate: charge.cycleEnrollment.cycleStartDate,
                cycleEndDate: charge.cycleEnrollment.cycleEndDate,
                amount: charge.pendingAmount || charge.amount,
                status: charge.cycleEnrollment.status,
              }
            : null
        }
        onSuccess={() => {
          router.refresh();
          onSuccess?.();
        }}
      />
    </>
  );
};

