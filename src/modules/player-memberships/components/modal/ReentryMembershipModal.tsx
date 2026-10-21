"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  Button,
  ProgressCircle,
  Label,
  useOverlayState,
  TextField,
  TextArea,
  Select,
  ListBox,
  Switch,
  Input,
  Alert,
  Chip,
} from "@heroui/react";
import { toast } from "sonner";
import {
  Calendar01Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  UserCheck01Icon,
  Coins01Icon,
  FileAttachmentIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  IPlayerMembership,
  IPlayerMembershipReentryInfo,
  getReentryInfoAction,
  reenterPlayerMembershipAction,
} from "@/modules/player-memberships";
import { formatCurrency } from "@/utils";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  membership: IPlayerMembership | null;
  onSuccess?: () => void;
}

const getTodayString = () => new Date().toISOString().slice(0, 10);

export const ReentryMembershipModal = ({
  isOpen,
  onOpenChange,
  membership,
  onSuccess,
}: Props) => {
  const state = useOverlayState({ isOpen, onOpenChange });
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reentryInfo, setReentryInfo] =
    useState<IPlayerMembershipReentryInfo | null>(null);

  // Form state
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(
    null,
  );
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [effectiveDate, setEffectiveDate] = useState<string>(getTodayString());
  const [chargeRegistration, setChargeRegistration] = useState<boolean>(true);
  const [skipCurrentMonthFee, setSkipCurrentMonthFee] =
    useState<boolean>(false);
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !membership) {
      setReentryInfo(null);
      return;
    }

    const loadData = async () => {
      setLoadingInfo(true);
      const res = await getReentryInfoAction(membership.id);
      setLoadingInfo(false);

      if (res.error || !res.data) {
        toast.error(res.message || "Error al cargar la información de reingreso");
        state.setOpen(false);
        return;
      }

      const info = res.data;
      setReentryInfo(info);

      // Default category: previous category if valid and has spots, else first available
      const currentCat = info.availableCategories.find(
        (c) => c.isCurrentCategory && (c.availableSpots === null || c.availableSpots > 0),
      );
      const fallbackCat = info.availableCategories.find(
        (c) => c.availableSpots === null || c.availableSpots > 0,
      );
      setSelectedCategoryKey(
        currentCat?.id ?? fallbackCat?.id ?? info.availableCategories[0]?.id ?? null,
      );

      // Default plan: first plan
      setSelectedPlanKey(info.availablePaymentPlans[0]?.id ?? null);

      // Date: today
      setEffectiveDate(getTodayString());

      // Registration fee policy: if already paid in season, default to NOT charging registration (waived)
      setChargeRegistration(!info.registrationFeeStatus.hasPaidInSeason);

      // Current month recurring fee: if already paid current month, default to skipping to prevent duplicate
      setSkipCurrentMonthFee(info.currentMonthStatus.hasPaidCurrentMonth);

      setNotes("");
    };

    loadData();
  }, [isOpen, membership?.id]);

  if (!membership) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("es-BO", {
      timeZone: "UTC",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryKey) {
      toast.error("Debe seleccionar una categoría para el reingreso");
      return;
    }
    if (!selectedPlanKey) {
      toast.error("Debe seleccionar un plan de pago para el reingreso");
      return;
    }
    if (!effectiveDate) {
      toast.error("Debe indicar la fecha efectiva de reingreso");
      return;
    }

    setSubmitting(true);
    try {
      const res = await reenterPlayerMembershipAction({
        previousMembershipId: membership.id,
        teamSeasonCategoryId: selectedCategoryKey,
        paymentPlanId: selectedPlanKey,
        startedAt: new Date(`${effectiveDate}T00:00:00.000Z`).toISOString(),
        chargeRegistration,
        skipCurrentMonthRecurringFee: skipCurrentMonthFee,
        notes: notes.trim() || undefined,
      });

      if (res.error) {
        toast.error(res.message || "Error al registrar el reingreso");
        return;
      }

      toast.success(res.message || "Reingreso registrado exitosamente");
      state.setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err.message || "Error inesperado al registrar reingreso");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCat = reentryInfo?.availableCategories.find(
    (c) => c.id === selectedCategoryKey,
  );
  const selectedPlan = reentryInfo?.availablePaymentPlans.find(
    (p) => p.id === selectedPlanKey,
  );

  return (
    <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
      <AlertDialog.Container>
        <AlertDialog.Dialog className="sm:max-w-2xl max-h-[92vh] flex flex-col p-0 overflow-hidden">
          <AlertDialog.CloseTrigger />

          <form
            onSubmit={handleConfirm}
            className="flex flex-col h-full overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-divider bg-content1/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={UserCheck01Icon} size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Registrar Reingreso de Jugador
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Genera una nueva membresía activa vinculada al mismo jugador,
                    conservando el historial anterior como registro cerrado.
                  </p>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {loadingInfo || !reentryInfo ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <ProgressCircle isIndeterminate aria-label="Cargando" />
                  <p className="text-sm text-muted-foreground">
                    Cargando antecedentes, deudas y opciones de reingreso...
                  </p>
                </div>
              ) : (
                <>
                  {/* 1. Antecedentes del jugador y membresía anterior */}
                  <div className="p-4 rounded-xl bg-content2/40 border border-divider space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Atleta
                        </div>
                        <div className="text-base font-bold text-foreground">
                          {reentryInfo.player.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          CI/Doc: {reentryInfo.player.documentNumber || "S/D"} ·
                          Nac: {formatDate(reentryInfo.player.birthDate)}
                        </div>
                      </div>
                      <Chip color="default" size="sm" variant="secondary">
                        Baja Registrada
                      </Chip>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-divider/60 text-xs">
                      <div>
                        <span className="text-muted-foreground">Temporada:</span>
                        <div className="font-medium text-foreground">
                          {reentryInfo.previousMembership.teamSeasonName}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Categoría anterior:</span>
                        <div className="font-medium text-foreground">
                          {reentryInfo.previousMembership.categoryName}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Fecha de retiro:</span>
                        <div className="font-medium text-foreground">
                          {formatDate(reentryInfo.previousMembership.endedAt)}
                        </div>
                      </div>
                    </div>

                    {reentryInfo.previousMembership.withdrawalReason && (
                      <div className="text-xs text-muted-foreground bg-content1/60 p-2 rounded-lg border border-divider/40">
                        <span className="font-semibold text-foreground">Motivo de baja: </span>
                        {reentryInfo.previousMembership.withdrawalReason}
                      </div>
                    )}
                  </div>

                  {/* 2. Configuración del Reingreso */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-primary" />
                      Parámetros de la Nueva Inscripción
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Categoría vigente */}
                      <Select
                        className="w-full"
                        selectedKey={selectedCategoryKey}
                        onSelectionChange={(key) =>
                          setSelectedCategoryKey(key as string)
                        }
                      >
                        <Label className="text-xs font-semibold">
                          Categoría destino
                        </Label>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {reentryInfo.availableCategories.map((cat) => {
                              const isFull =
                                cat.availableSpots !== null &&
                                cat.availableSpots <= 0;
                              return (
                                <ListBox.Item
                                  key={cat.id}
                                  id={cat.id}
                                  textValue={cat.name}
                                  isDisabled={isFull}
                                >
                                  <div className="flex justify-between items-center w-full">
                                    <span>{cat.name}</span>
                                    <span
                                      className={`text-xs ml-2 ${isFull
                                        ? "text-danger"
                                        : "text-muted-foreground"
                                        }`}
                                    >
                                      {cat.availableSpots !== null
                                        ? `${cat.activeMembers}/${cat.maxMembers} cupos`
                                        : "Sin límite"}
                                    </span>
                                  </div>
                                </ListBox.Item>
                              );
                            })}
                          </ListBox>
                        </Select.Popover>
                      </Select>

                      {/* Plan de pagos */}
                      <Select
                        className="w-full"
                        selectedKey={selectedPlanKey}
                        onSelectionChange={(key) =>
                          setSelectedPlanKey(key as string)
                        }
                      >
                        <Label className="text-xs font-semibold">
                          Plan de pagos
                        </Label>
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {reentryInfo.availablePaymentPlans.map((pp) => (
                              <ListBox.Item
                                key={pp.id}
                                id={pp.id}
                                textValue={pp.name}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span>{pp.name}</span>
                                  {pp.isSinglePayment ? (
                                    <span className="text-xs text-primary font-medium ml-2">
                                      Pago Único
                                    </span>
                                  ) : (
                                    pp.recurringDiscountPercent > 0 && (
                                      <span className="text-xs text-success ml-2">
                                        -{pp.recurringDiscountPercent}%
                                      </span>
                                    )
                                  )}
                                </div>
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Fecha de inicio */}
                    <TextField className="w-full">
                      <Label className="text-xs font-semibold">
                        Fecha efectiva de reingreso
                      </Label>
                      <Input
                        type="date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                      />
                    </TextField>
                  </div>

                  {/* 3. Matrícula y Cuota del Mismo Mes */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      <HugeiconsIcon icon={Coins01Icon} size={16} className="text-primary" />
                      Tratamiento de Cobros y Matrícula
                    </h3>

                    {/* Matrícula */}
                    <div className="p-3.5 rounded-xl border border-divider bg-content1/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HugeiconsIcon icon={FileAttachmentIcon} size={16} className="text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            Matrícula de inscripción
                          </span>
                        </div>
                        {reentryInfo.registrationFeeStatus.hasPaidInSeason ? (
                          <Chip color="success" size="sm" variant="secondary">
                            Ya pagada en temporada
                          </Chip>
                        ) : (
                          <Chip color="warning" size="sm" variant="secondary">
                            Sin registro previo
                          </Chip>
                        )}
                      </div>

                      {reentryInfo.registrationFeeStatus.hasPaidInSeason && (
                        <p className="text-xs text-muted-foreground">
                          El jugador abonó Bs.{" "}
                          {reentryInfo.registrationFeeStatus.paidAmount || 0} de
                          matrícula anteriormente{" "}
                          {reentryInfo.registrationFeeStatus.receiptNumber
                            ? `(Recibo: ${reentryInfo.registrationFeeStatus.receiptNumber})`
                            : ""}
                          .
                        </p>
                      )}

                      <div className="pt-2">
                        <Switch
                          isSelected={chargeRegistration}
                          onChange={setChargeRegistration}
                        >
                          <Switch.Content>
                            <Switch.Control>
                              <Switch.Thumb />
                            </Switch.Control>
                            <Label className="text-xs font-medium cursor-pointer">
                              {chargeRegistration
                                ? "Cobrar matrícula en el reingreso"
                                : "Exonerar cobro de matrícula (política autorizada por pago previo)"}
                            </Label>
                          </Switch.Content>
                        </Switch>
                      </div>
                    </div>

                    {/* Mismo mes */}
                    {reentryInfo.currentMonthStatus.hasPaidCurrentMonth && (
                      <Alert status="accent">
                        <Alert.Indicator />
                        <Alert.Content>
                          <Alert.Title className="text-xs font-semibold">
                            Pago detectado en el mismo mes ({reentryInfo.currentMonthStatus.currentMonth}/
                            {reentryInfo.currentMonthStatus.currentYear})
                          </Alert.Title>
                          <Alert.Description className="text-xs mt-1 space-y-2">
                            <p>
                              El jugador ya tiene registrada una cuota pagada
                              por Bs. {reentryInfo.currentMonthStatus.paidAmount}{" "}
                              correspondiente al mes en curso antes de su baja.
                            </p>
                            <Switch
                              isSelected={skipCurrentMonthFee}
                              onChange={setSkipCurrentMonthFee}
                            >
                              <Switch.Content>
                                <Switch.Control>
                                  <Switch.Thumb />
                                </Switch.Control>
                                <Label className="text-xs font-medium cursor-pointer">
                                  Omitir cobro del mes en curso para evitar
                                  cuota duplicada
                                </Label>
                              </Switch.Content>
                            </Switch>
                          </Alert.Description>
                        </Alert.Content>
                      </Alert>
                    )}
                  </div>

                  {/* 4. Deudas Históricas */}
                  {reentryInfo.historicalDebts.hasPendingDebts ? (
                    <div className="space-y-2 pt-2">
                      <Alert status="warning">
                        <Alert.Indicator />
                        <Alert.Content>
                          <Alert.Title className="text-xs font-semibold">
                            Deudas Históricas Exigibles: Bs.{" "}
                            {reentryInfo.historicalDebts.totalPendingAmount.toFixed(
                              2,
                            )}
                          </Alert.Title>
                          <Alert.Description className="text-xs mt-1">
                            El reingreso no borra ni consolida deudas anteriores.
                            Los siguientes cargos permanecen pendientes y exigibles:
                            <ul className="list-disc list-inside mt-2 space-y-0.5 text-xs text-muted-foreground">
                              {reentryInfo.historicalDebts.pendingCharges.map(
                                (pc) => (
                                  <li key={pc.id}>
                                    {pc.description}: Bs. {pc.pendingAmount.toFixed(2)}{" "}
                                    (Vence: {formatDate(pc.dueDate)})
                                  </li>
                                ),
                              )}
                            </ul>
                          </Alert.Description>
                        </Alert.Content>
                      </Alert>
                    </div>
                  ) : null}

                  {/* 5. Cargos Cancelados */}
                  {reentryInfo.cancelledChargesOnWithdrawal.length > 0 && (
                    <div className="text-xs text-muted-foreground px-1">
                      ℹ️ {reentryInfo.cancelledChargesOnWithdrawal.length} cuotas
                      futuras fueron canceladas oportunamente al formalizar la baja anterior.
                    </div>
                  )}

                  {/* 6. Observaciones */}
                  <TextField className="w-full">
                    <Label className="text-xs font-semibold">
                      Motivo / Observaciones del Reingreso (Opcional)
                    </Label>
                    <TextArea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej. Reingreso autorizado por Dirección tras periodo de viaje familiar..."
                      rows={2}
                    />
                  </TextField>

                  {/* 7. Resumen de Confirmación */}
                  <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1.5 text-xs">
                    <div className="font-semibold text-primary flex items-center gap-1.5">
                      <HugeiconsIcon icon={CheckmarkCircle02Icon} size={15} />
                      Resumen del Reingreso
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground pt-1">
                      <div>
                        Nueva membresía:{" "}
                        <strong className="text-foreground">
                          {selectedCat?.name || "Sin seleccionar"}
                        </strong>
                      </div>
                      <div>
                        Plan de cobro:{" "}
                        <strong className="text-foreground">
                          {selectedPlan?.name || "Sin seleccionar"}
                        </strong>
                      </div>
                      <div>
                        Fecha inicio:{" "}
                        <strong className="text-foreground">
                          {effectiveDate}
                        </strong>
                      </div>
                      <div>
                        Matrícula:{" "}
                        <strong
                          className={
                            chargeRegistration
                              ? "text-foreground"
                              : "text-success"
                          }
                        >
                          {chargeRegistration ? "Se cobrará" : "Exonerada"}
                        </strong>
                      </div>
                      {reentryInfo.currentMonthStatus.hasPaidCurrentMonth && (
                        <div className="col-span-2">
                          Cuota de este mes:{" "}
                          <strong className="text-foreground">
                            {skipCurrentMonthFee
                              ? "Omitida (ya pagada antes de la baja)"
                              : "Se generará"}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-divider bg-content1/50 flex items-center justify-end gap-2 shrink-0">
              <Button
                variant="tertiary"
                onPress={() => state.setOpen(false)}
                isDisabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                isPending={submitting}
                isDisabled={loadingInfo || !reentryInfo || !selectedCategoryKey}
              >
                Confirmar Reingreso
              </Button>
            </div>
          </form>
        </AlertDialog.Dialog>
      </AlertDialog.Container>
    </AlertDialog.Backdrop>
  );
};
