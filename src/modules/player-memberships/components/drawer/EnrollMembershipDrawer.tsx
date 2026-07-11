"use client";
import {
  Button,
  ComboBox,
  Drawer,
  Input,
  Label,
  ListBox,
  Surface,
  Switch,
  TextField,
  toast,
  useOverlayState,
  Alert,
  FieldError,
  Popover,
} from "@heroui/react";
import {
  Add01Icon,
  UserAdd01Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { IPlayer } from "@/modules/players";
import {
  addPlayerMembership,
  getPreviewCharges,
  IPlayerOption,
  IPreviewChargesResponse,
} from "@/modules/player-memberships";
import { calculateInitialCharges } from "@/modules/player-memberships/helpers/initial-charges";
import { InvoicePreview } from "@/modules/player-memberships/components/invoice/InvoicePreview";
import { SelectOrCreatePlayer } from "./SelectOrCreatePlayer";

interface Props {
  teamSeason: ITeamSeason;
  paymentPlans: IPaymentPlan[];
  size?: "lg" | "md" | "sm";
}

const today = () => new Date().toISOString().slice(0, 10);

export const EnrollMembershipDrawer = ({
  teamSeason,
  paymentPlans,
  size = "md",
}: Props) => {
  const state = useOverlayState();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [playerKey, setPlayerKey] = useState<string | null>(null);
  const [planKey, setPlanKey] = useState<string | null>(
    paymentPlans.find((p) => p.isDefault)?.id ?? null,
  );
  const [startedAt, setStartedAt] = useState<string>(today());
  const [isMigrated, setIsMigrated] = useState(false);

  const [hasDiscount, setHasDiscount] = useState(false);
  const [regDiscountPercent, setRegDiscountPercent] = useState<string>("");
  const [recDiscountPercent, setRecDiscountPercent] = useState<string>("");
  const [discountType, setDiscountType] = useState<string>("SPECIAL_DISCOUNT");
  const [discountReason, setDiscountReason] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState<string>("");

  const [selectedPlayer, setSelectedPlayer] = useState<IPlayerOption | null>(
    null,
  );

  const selectedPlan = paymentPlans.find((p) => p.id === planKey) ?? null;

  const [breakdown, setBreakdown] = useState<IPreviewChargesResponse | null>(
    null,
  );

  // Validaciones en tiempo real
  const errors = useMemo(() => {
    const err: Record<string, string> = {};
    const sStart = new Date(teamSeason.season.startDate);
    const sEnd = new Date(teamSeason.season.endDate);
    const dStart = startedAt ? new Date(startedAt) : null;

    if (!playerKey) err.playerKey = "Seleccione un atleta.";
    if (!planKey) err.planKey = "Seleccione un plan de pago.";
    if (!startedAt) err.startedAt = "Debe ingresar una fecha de inicio.";
    else if (dStart && (dStart < sStart || dStart > sEnd)) {
      err.startedAt = `La fecha de inicio debe estar dentro de la temporada (${sStart.toLocaleDateString()} - ${sEnd.toLocaleDateString()}).`;
    }

    if (hasDiscount) {
      const reg = Number(regDiscountPercent);
      const rec = Number(recDiscountPercent);

      if (!regDiscountPercent && !recDiscountPercent) {
        err.discountPercent =
          "Debe ingresar al menos un porcentaje de descuento (Matrícula o Mensualidad).";
      }
      if (regDiscountPercent && (isNaN(reg) || reg < 0 || reg > 100)) {
        err.regDiscountPercent =
          "El descuento debe ser mayor o igual a 0 y máximo 100.";
      }
      if (recDiscountPercent && (isNaN(rec) || rec < 0 || rec > 100)) {
        err.recDiscountPercent =
          "El descuento debe ser mayor o igual a 0 y máximo 100.";
      }

      if (!discountType) {
        err.discountType = "Seleccione un tipo de descuento.";
      }

      if (discountType === "OTHER" && !discountReason.trim()) {
        err.discountReason = "Especifique una razón o justificación.";
      }

      if (discountEndDate) {
        const dEnd = new Date(discountEndDate);
        if (dStart && dEnd < dStart) {
          err.discountEndDate =
            "La fecha de fin no puede ser menor a la de inicio.";
        }
        if (dEnd > sEnd) {
          err.discountEndDate = `La fecha de fin no puede exceder la temporada (${sEnd.toLocaleDateString()}).`;
        }
      }
    }
    return err;
  }, [
    playerKey,
    planKey,
    startedAt,
    hasDiscount,
    discountEndDate,
    regDiscountPercent,
    recDiscountPercent,
    discountType,
    discountReason,
    teamSeason,
  ]);

  const reset = () => {
    setPlayerKey(null);
    setPlanKey(paymentPlans.find((p) => p.isDefault)?.id ?? null);
    setStartedAt(today());
    setIsMigrated(false);
    setHasDiscount(false);
    setRegDiscountPercent("");
    setRecDiscountPercent("");
    setDiscountType("SPECIAL_DISCOUNT");
    setDiscountReason("");
    setDiscountEndDate("");
    setBreakdown(null);
  };

  useEffect(() => {
    if (!playerKey || !planKey || !startedAt) return;
    handlePreview();
  }, [
    playerKey,
    planKey,
    startedAt,
    isMigrated,
    hasDiscount,
    regDiscountPercent,
    recDiscountPercent,
    discountEndDate,
  ]);

  const handlePreview = async () => {
    if (!playerKey || !planKey || !startedAt) {
      return;
    }

    const res = await getPreviewCharges({
      teamSeasonId: teamSeason.id,
      paymentPlanId: planKey,
      startDate: new Date(startedAt).toISOString(),
      isMigrated,
      ...(hasDiscount &&
        (regDiscountPercent !== "" || recDiscountPercent !== "") && {
          membershipDiscounts: [
            {
              registrationDiscountPercent: Number(regDiscountPercent) || 0,
              recurringDiscountPercent: Number(recDiscountPercent) || 0,
              startDate: new Date(startedAt).toISOString(),
              ...(discountEndDate && {
                endDate: new Date(discountEndDate).toISOString(),
              }),
            },
          ],
        }),
    });
    console.log({ res });

    if (res.error) {
      toast.danger(res.message, {
        description: res.errors
          ? Object.values(res.errors).flat().join(", ")
          : res.message,
      });
      setBreakdown(null);
      return;
    }

    setBreakdown(res.data);
  };

  const handleSubmit = async () => {
    if (!playerKey || !planKey || !startedAt) {
      toast.danger("Datos incompletos", {
        description:
          "Selecciona el atleta, el plan de pago y la fecha de inicio.",
      });
      return;
    }

    const sStart = new Date(teamSeason.season.startDate);
    const sEnd = new Date(teamSeason.season.endDate);
    const dStart = new Date(startedAt);

    if (dStart < sStart || dStart > sEnd) {
      toast.danger("Fecha inválida", {
        description: `La fecha de inicio de la membresía debe estar dentro de la temporada (${sStart.toLocaleDateString()} - ${sEnd.toLocaleDateString()}).`,
      });
      return;
    }

    if (hasDiscount && discountEndDate) {
      const dEnd = new Date(discountEndDate);
      if (dEnd < dStart) {
        toast.danger("Fecha de descuento inválida", {
          description:
            "La fecha de fin del descuento no puede ser menor a la fecha de inicio.",
        });
        return;
      }
      if (dEnd > sEnd) {
        toast.danger("Fecha de descuento inválida", {
          description: `La fecha de fin del descuento no puede exceder el final de la temporada (${sEnd.toLocaleDateString()}).`,
        });
        return;
      }
    }

    if (Object.keys(errors).length > 0) {
      toast.danger("Existen campos inválidos", {
        description: "Revisa el formulario para corregir los errores.",
      });
      return;
    }

    setLoading(true);
    const res = await addPlayerMembership({
      playerId: playerKey,
      teamSeasonId: teamSeason.id,
      paymentPlanId: planKey,
      startedAt: new Date(startedAt).toISOString(),
      isMigrated,
      ...(hasDiscount && {
        membershipDiscounts: [
          {
            registrationDiscountPercent: Number(regDiscountPercent) || 0,
            recurringDiscountPercent: Number(recDiscountPercent) || 0,
            startDate: new Date(startedAt).toISOString(),
            ...(discountEndDate && {
              endDate: new Date(discountEndDate).toISOString(),
            }),
            type: discountType,
            reason: discountReason || undefined,
          },
        ],
      }),
    });
    setLoading(false);

    if (res.error) {
      toast.danger(res.message, {
        description: res.errors
          ? Object.values(res.errors).flat().join(", ")
          : res.message,
      });
      return;
    }
    toast.success(res.message, {
      description: selectedPlayer
        ? `${selectedPlayer?.person?.fullName} fue inscrito en la temporada.`
        : undefined,
    });
    reset();
    state.close();
    router.refresh();
  };

  const noPlans = paymentPlans.length === 0;

  const [isOpen, setIsOpen] = useState(false);

  const InfoTooltip = ({ text }: { text: string }) => (
    <Popover>
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        className="h-5 w-5 min-w-5 text-muted-foreground ml-2"
      >
        <HugeiconsIcon icon={InformationCircleIcon} size={14} />
      </Button>
      <Popover.Content placement="top">
        <Popover.Dialog className="max-w-50 px-3 py-2">
          <Popover.Arrow />
          <p className="text-xs font-normal normal-case tracking-normal text-foreground">
            {text}
          </p>
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );

  return (
    <>
      <Button
        size={size}
        className="w-full bg-accent text-accent-foreground font-semibold text-sm shadow-md shadow-accent-soft-hover hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all"
        onPress={() => setIsOpen(true)}
      >
        <HugeiconsIcon icon={UserAdd01Icon} size={18} />
        Inscribir Atleta
      </Button>

      <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md">
            <Drawer.CloseTrigger />
            <Drawer.Header className="border-b border-border">
              <div>
                <Drawer.Heading className="text-lg font-bold">
                  Inscribir atleta
                </Drawer.Heading>
                <p className="mt-1 text-xs font-medium text-muted">
                  {teamSeason.team.name} · {teamSeason.season.name}
                </p>
              </div>
            </Drawer.Header>

            <Drawer.Body className="gap-5">
              <Surface variant="transparent" className="flex flex-col gap-5">
                <Alert status="accent" className="mb-2">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>Fechas y Prorrateo</Alert.Title>
                    <Alert.Description>
                      La fecha de inicio que elijas determinará cómo el motor
                      financiero aplica el cálculo de prorrateo (si está activo
                      en la temporada) para la primera cuota.
                    </Alert.Description>
                  </Alert.Content>
                </Alert>

                <Alert status="accent" className="mb-2">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Title>
                      Categoría: {teamSeason.category.name} (
                      {teamSeason.category.minAge} -{" "}
                      {teamSeason.category.maxAge} años)
                    </Alert.Title>
                    <Alert.Description>
                      <p className="mb-1">
                        {teamSeason.minBirthYear || teamSeason.maxBirthYear
                          ? `Años de nacimiento permitidos: ${teamSeason.minBirthYear || "Cualquiera"} al ${teamSeason.maxBirthYear || "Cualquiera"}`
                          : `El atleta debe tener entre ${teamSeason.category.minAge} y ${teamSeason.category.maxAge} años en el año actual.`}
                      </p>
                      <p>
                        <strong>Duración de la temporada:</strong>{" "}
                        {new Date(
                          teamSeason.season.startDate,
                        ).toLocaleDateString()}{" "}
                        -{" "}
                        {new Date(
                          teamSeason.season.endDate,
                        ).toLocaleDateString()}
                      </p>
                    </Alert.Description>
                  </Alert.Content>
                </Alert>

                {/* Player picker */}
                <SelectOrCreatePlayer
                  playerId={playerKey}
                  setPlayerId={setPlayerKey}
                  setSelectedPlayer={setSelectedPlayer}
                  // isDisabled={noPlayers}
                  label="Atleta"
                  errors={errors}
                />

                {/* Payment plan picker */}
                <ComboBox
                  className="w-full"
                  variant="secondary"
                  menuTrigger="focus"
                  selectedKey={planKey}
                  onSelectionChange={(key) =>
                    setPlanKey(key ? String(key) : null)
                  }
                  isDisabled={noPlans}
                  isInvalid={!!errors.planKey || undefined}
                >
                  <Label className="text-sm font-semibold flex items-center">
                    Plan de pago
                    <InfoTooltip text="Los planes definen si se cobra de forma adelantada, recurrente, y sus respectivos descuentos aplicables." />
                  </Label>
                  <ComboBox.InputGroup>
                    <Input
                      variant="secondary"
                      placeholder={
                        noPlans
                          ? "Crea un plan de pago primero"
                          : "Selecciona un plan de pago"
                      }
                    />
                    <ComboBox.Trigger />
                  </ComboBox.InputGroup>
                  <ComboBox.Popover>
                    <ListBox>
                      {paymentPlans.map((plan) => (
                        <ListBox.Item
                          key={plan.id}
                          id={plan.id}
                          textValue={plan.name}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium flex items-center gap-2">
                              {plan.name}
                              {plan.isDefault && (
                                <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                                  Default
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-muted">
                              {plan.isSinglePayment
                                ? teamSeason.billingType === "MONTHLY_ONLY"
                                  ? `Pago Único (Adelantado) • -${plan.recurringDiscountPercent}% (Mensualidades)`
                                  : `Pago Único • -${plan.seasonFeeDiscountPercent}% (Temporada)`
                                : `Insc. -${plan.registrationDiscountPercent}% • Mens. -${plan.recurringDiscountPercent}%`}
                            </span>
                          </div>
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </ComboBox.Popover>
                </ComboBox>

                {/* Start date */}
                <TextField
                  className="w-full"
                  name="startedAt"
                  isInvalid={!!errors.startedAt || undefined}
                >
                  <Label className="text-sm font-semibold flex items-center">
                    Fecha de inicio
                    <InfoTooltip text="Fecha en la que el sistema se basa para cobrar. Si la fecha cae a la mitad de un ciclo mensual (y el prorrateo está activo), el cobro será parcial." />
                  </Label>
                  <Input
                    variant="secondary"
                    type="date"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                  />
                  {errors.startedAt && (
                    <FieldError>{errors.startedAt}</FieldError>
                  )}
                </TextField>

                {/* Switch for migration */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 px-1">
                    <Switch isSelected={hasDiscount} onChange={setHasDiscount}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                      <Switch.Content>
                        <Label className="text-sm font-semibold flex items-center">
                          Aplicar Descuento Excepcional
                          <InfoTooltip text="Estos descuentos se sumarán a los que ya otorga el plan elegido (el total acumulado no puede exceder el 100%)." />
                        </Label>
                      </Switch.Content>
                    </Switch>
                  </div>

                  {hasDiscount && (
                    <div className="flex flex-col gap-4 pl-4 border-l-2 border-border mb-2">
                      <div className="flex gap-4">
                        <TextField
                          className="w-full"
                          isInvalid={
                            !!errors.regDiscountPercent ||
                            !!errors.discountPercent ||
                            undefined
                          }
                        >
                          <Label className="text-sm font-semibold">
                            Desc. Matrícula (%)
                          </Label>
                          <Input
                            variant="secondary"
                            type="number"
                            placeholder="Ej. 50"
                            value={regDiscountPercent}
                            onChange={(e) =>
                              setRegDiscountPercent(e.target.value)
                            }
                          />
                          <p className="text-xs text-muted mt-1 leading-tight">
                            Dejar vacío si no aplica.
                          </p>
                          {(errors.regDiscountPercent ||
                            errors.discountPercent) && (
                            <FieldError>
                              {errors.regDiscountPercent ||
                                errors.discountPercent}
                            </FieldError>
                          )}
                        </TextField>
                        <TextField
                          className="w-full"
                          isInvalid={
                            !!errors.recDiscountPercent ||
                            !!errors.discountPercent ||
                            undefined
                          }
                        >
                          <Label className="text-sm font-semibold">
                            Desc. Mensualidad (%)
                          </Label>
                          <Input
                            variant="secondary"
                            type="number"
                            placeholder="Ej. 10"
                            value={recDiscountPercent}
                            onChange={(e) =>
                              setRecDiscountPercent(e.target.value)
                            }
                          />
                          <p className="text-xs text-muted mt-1 leading-tight">
                            Dejar vacío si no aplica.
                          </p>
                          {(errors.recDiscountPercent ||
                            (errors.discountPercent &&
                              !errors.regDiscountPercent)) && (
                            <FieldError>
                              {errors.recDiscountPercent ||
                                errors.discountPercent}
                            </FieldError>
                          )}
                        </TextField>
                      </div>

                      <ComboBox
                        className="w-full"
                        variant="secondary"
                        menuTrigger="focus"
                        selectedKey={discountType}
                        onSelectionChange={(key) =>
                          setDiscountType(
                            key ? String(key) : "SPECIAL_DISCOUNT",
                          )
                        }
                        isInvalid={!!errors.discountType || undefined}
                      >
                        <Label className="text-sm font-semibold">
                          Tipo de Descuento
                        </Label>
                        <ComboBox.InputGroup>
                          <Input variant="secondary" />
                          <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover>
                          <ListBox>
                            <ListBox.Item id="SCHOLARSHIP" textValue="Beca">
                              Beca
                            </ListBox.Item>
                            <ListBox.Item
                              id="SPECIAL_DISCOUNT"
                              textValue="Descuento especial"
                            >
                              Descuento especial
                            </ListBox.Item>
                            <ListBox.Item
                              id="FINANCIAL_AID"
                              textValue="Ayuda económica"
                            >
                              Ayuda económica
                            </ListBox.Item>
                            <ListBox.Item id="AGREEMENT" textValue="Convenio">
                              Convenio
                            </ListBox.Item>
                            <ListBox.Item
                              id="EXEMPTION"
                              textValue="Exoneración"
                            >
                              Exoneración
                            </ListBox.Item>
                            <ListBox.Item id="OTHER" textValue="Otro">
                              Otro
                            </ListBox.Item>
                          </ListBox>
                        </ComboBox.Popover>
                      </ComboBox>

                      <TextField
                        className="w-full"
                        isInvalid={!!errors.discountReason || undefined}
                      >
                        <Label className="text-sm font-semibold">
                          Razón / Justificación
                        </Label>
                        <Input
                          variant="secondary"
                          placeholder="Ej. Convenio con la municipalidad"
                          value={discountReason}
                          onChange={(e) => setDiscountReason(e.target.value)}
                        />
                        <p className="text-xs text-muted mt-1 leading-tight">
                          Opcional, salvo que el tipo sea "Otro".
                        </p>
                        {errors.discountReason && (
                          <FieldError>{errors.discountReason}</FieldError>
                        )}
                      </TextField>

                      <TextField
                        className="w-full"
                        isInvalid={!!errors.discountEndDate || undefined}
                      >
                        <Label className="text-sm font-semibold">
                          Fecha Fin del Descuento (Opcional)
                        </Label>
                        <Input
                          variant="secondary"
                          type="date"
                          value={discountEndDate}
                          onChange={(e) => setDiscountEndDate(e.target.value)}
                        />
                        <p className="text-xs text-muted mt-1 leading-tight">
                          Si se deja en blanco, el descuento será permanente
                          hasta que termine la temporada.
                        </p>
                        {errors.discountEndDate && (
                          <FieldError>{errors.discountEndDate}</FieldError>
                        )}
                      </TextField>
                    </div>
                  )}
                </div>

                {/* Switch for migration */}
                <div className="flex items-center gap-2 px-1">
                  <Switch isSelected={isMigrated} onChange={setIsMigrated}>
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <Label className="text-sm flex items-center">
                        Es Migración (omitir cargos iniciales)
                        <InfoTooltip text="Activa esta opción si el jugador ya está en la temporada por migración de datos y NO deseas generar sus cargos de inscripción ahora." />
                      </Label>
                    </Switch.Content>
                  </Switch>
                </div>

                {/* {JSON.stringify({
                  teamSeasonId: teamSeason.id,
                  playerKey,
                  planKey,
                  startedAt,
                  // breakdown,
                })} */}

                {/* {JSON.stringify({ breakdown })} */}

                {/* Errores globales */}
                {Object.keys(errors).length > 0 && (
                  <Alert status="danger">
                    <Alert.Indicator />
                    <Alert.Content>
                      <Alert.Title>
                        Formulario incompleto o inválido
                      </Alert.Title>
                      <Alert.Description>
                        <ul className="list-disc pl-5 mt-1 text-sm space-y-1">
                          {Object.entries(errors).map(([field, msg]) => (
                            <li key={field}>{msg}</li>
                          ))}
                        </ul>
                      </Alert.Description>
                    </Alert.Content>
                  </Alert>
                )}

                {/* Live invoice preview */}
                {breakdown?.data && (
                  <InvoicePreview
                    breakdown={breakdown}
                    planName={selectedPlan?.name}
                    playerName={
                      selectedPlayer ? selectedPlayer.person.fullName : null
                    }
                  />
                )}
              </Surface>
            </Drawer.Body>

            <Drawer.Footer className="border-t border-border">
              <Button
                slot="close"
                variant="secondary"
                isDisabled={loading}
                onPress={() => reset()}
                className="font-medium"
              >
                Cancelar
              </Button>
              <Button
                onPress={handleSubmit}
                isPending={loading}
                isDisabled={
                  loading || noPlans || Object.keys(errors).length > 0
                }
                className="font-semibold"
              >
                <HugeiconsIcon icon={Add01Icon} size={18} />
                Confirmar
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
