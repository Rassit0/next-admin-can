"use client";
import { iconMap } from "@/utils/iconMap";
import {
  FieldError,
  Form,
  Input,
  Label,
  Surface,
  TextField,
  toast,
  ComboBox,
  Select,
  ListBox,
  Switch,
  Description,
  Alert,
  Popover,
  Button,
  Modal,
  useOverlayState,
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import React, { useCallback, useState } from "react";
import {
  addPaymentPlan,
  editPaymentPlan,
  IPaymentPlan,
} from "@/modules/payment-plans";
import { InfoTooltip } from "@/ui";
import { ExamplesModal } from "@/modules/payment-plans/components/modal/ExamplesModal";

interface Props {
  paymentPlan?: IPaymentPlan;
  teamSeasonId?: string;
  courseSeasonId?: string;
  teamSeasonBillingType?: string;
  courseSeasonBillingType?: string;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormPaymentPlan = ({
  paymentPlan,
  teamSeasonId,
  courseSeasonId,
  teamSeasonBillingType,
  courseSeasonBillingType,
  formId,
  onSubmited,
  isLoading,
  setIsLoading,
}: Props) => {
  const [name, setName] = useState(paymentPlan?.name || null);
  const [registrationDiscountPercent, setRegistrationDiscountPercent] =
    useState<string | null>(paymentPlan?.registrationDiscountPercent || null);
  const [recurringDiscountPercent, setMonthlyDiscountPercent] = useState<
    string | null
  >(paymentPlan?.recurringDiscountPercent || null);
  const [seasonFeeDiscountPercent, setSeasonFeeDiscountPercent] = useState<
    string | null
  >(paymentPlan?.seasonFeeDiscountPercent || null);

  const billingType = teamSeasonBillingType || courseSeasonBillingType;

  const [isDefault, setIsDefault] = useState<boolean>(
    paymentPlan?.isDefault || false,
  );
  const [isSinglePayment, setIsSinglePayment] = useState<boolean>(
    billingType === "SINGLE_ONLY"
      ? true
      : paymentPlan?.isSinglePayment || false,
  );
  const [advanceCycles, setAdvanceCycles] = useState<number>(
    paymentPlan?.advanceCycles || 1,
  );
  const [promotionalCycles, setPromotionalCycles] = useState<number>(
    paymentPlan?.promotionalCycles || 1,
  );
  const [advanceCyclesDiscountPercent, setAdvanceCyclesDiscountPercent] =
    useState<string>(
      paymentPlan?.advanceCyclesDiscountPercent?.toString() || "0",
    );

  const examplesModalState = useOverlayState();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const handleRemoveError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const newErrors: Record<string, string> = {};
    if (!name) {
      newErrors.name = "Debe ingresar un nombre";
    }
    let registration = registrationDiscountPercent || "0";
    let recurring = recurringDiscountPercent || "0";
    let season = seasonFeeDiscountPercent || "0";

    const isInvalidPercent = (val: string) => {
      const num = parseFloat(val);
      return isNaN(num) || num < 0 || num > 100;
    };

    // Validations based on visible fields
    if (billingType === "SINGLE_ONLY") {
      if (!seasonFeeDiscountPercent) {
        newErrors.seasonFeeDiscountPercent =
          "Debe ingresar un descuento para la temporada";
      } else if (isInvalidPercent(season)) {
        newErrors.seasonFeeDiscountPercent =
          "El porcentaje debe estar entre 0 y 100";
      }
      registration = "0";
      recurring = "0";
    } else if (billingType === "MONTHLY_ONLY") {
      if (!registrationDiscountPercent) {
        newErrors.registrationDiscountPercent =
          "Debe ingresar un descuento de inscripción";
      } else if (isInvalidPercent(registration)) {
        newErrors.registrationDiscountPercent =
          "El porcentaje debe estar entre 0 y 100";
      }

      if (!recurringDiscountPercent) {
        newErrors.recurringDiscountPercent =
          "Debe ingresar un descuento de cuota recurrente";
      } else if (isInvalidPercent(recurring)) {
        newErrors.recurringDiscountPercent =
          "El porcentaje debe estar entre 0 y 100";
      }
      season = "0";
    } else {
      // BOTH
      if (isSinglePayment) {
        if (!seasonFeeDiscountPercent) {
          newErrors.seasonFeeDiscountPercent =
            "Debe ingresar un descuento para la temporada";
        } else if (isInvalidPercent(season)) {
          newErrors.seasonFeeDiscountPercent =
            "El porcentaje debe estar entre 0 y 100";
        }
        registration = "0";
        recurring = "0";
      } else {
        if (!registrationDiscountPercent) {
          newErrors.registrationDiscountPercent =
            "Debe ingresar un descuento de inscripción";
        } else if (isInvalidPercent(registration)) {
          newErrors.registrationDiscountPercent =
            "El porcentaje debe estar entre 0 y 100";
        }

        if (!recurringDiscountPercent) {
          newErrors.recurringDiscountPercent =
            "Debe ingresar un descuento de cuota recurrente";
        } else if (isInvalidPercent(recurring)) {
          newErrors.recurringDiscountPercent =
            "El porcentaje debe estar entre 0 y 100";
        }

        if (advanceCycles < 1)
          newErrors.advanceCycles = "Debe agrupar al menos 1 cuota";
        if (promotionalCycles < 1 || promotionalCycles > advanceCycles)
          newErrors.promotionalCycles = "Debe ser mayor a 0 y no mayor a las cuotas agrupadas";
        if (isInvalidPercent(advanceCyclesDiscountPercent)) {
          newErrors.advanceCyclesDiscountPercent =
            "El porcentaje debe estar entre 0 y 100";
        }
        season = "0";
      }
    }

    if (billingType === "MONTHLY_ONLY") {
      if (advanceCycles < 1)
        newErrors.advanceCycles = "Debe agrupar al menos 1 cuota";
      if (promotionalCycles < 1 || promotionalCycles > advanceCycles)
        newErrors.promotionalCycles = "Debe ser mayor a 0 y no mayor a las cuotas agrupadas";
      if (isInvalidPercent(advanceCyclesDiscountPercent)) {
        newErrors.advanceCyclesDiscountPercent =
          "El porcentaje debe estar entre 0 y 100";
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setIsLoading?.(true);
    let res;
    const data = {
      teamSeasonId,
      courseSeasonId,
      name: name!,
      registrationDiscountPercent: registration,
      recurringDiscountPercent: recurring,
      seasonFeeDiscountPercent: season,
      isDefault,
      isSinglePayment,
      advanceCycles:
        isSinglePayment || billingType === "SINGLE_ONLY" ? 1 : advanceCycles,
      promotionalCycles:
        isSinglePayment || billingType === "SINGLE_ONLY" ? 0 : promotionalCycles,
      advanceCyclesDiscountPercent:
        isSinglePayment || billingType === "SINGLE_ONLY"
          ? "0"
          : advanceCyclesDiscountPercent,
    };
    if (paymentPlan) {
      res = await editPaymentPlan({ id: paymentPlan.id, data });
    } else {
      res = await addPaymentPlan(data);
    }
    setIsLoading?.(false);
    if (res.error) {
      let errorDescription = res.message;

      if (res.errors) {
        // Convertimos el objeto { type: ["msg"] } en una lista de strings limpia
        errorDescription = Object.entries(res.errors)
          .map(([field, messages]) => {
            const msgList = Array.isArray(messages)
              ? messages.join(", ")
              : messages;
            return `${field}: ${msgList}`;
          })
          .join("\n"); // Los separamos por saltos de línea para el toast
      }

      // 2. Pasamos la descripción formateada al componente de notificaciones
      toast.danger(res.message, {
        description: errorDescription,
      });
      if (res.errors) {
        setErrors(res.errors);
      }
      return;
    }
    toast.success(res.message, {
      description: res.message,
    });
    onSubmited?.();
  };

  const applyExample = (example: Partial<IPaymentPlan>) => {
    if (example.name !== undefined) setName(example.name);
    if (example.registrationDiscountPercent !== undefined)
      setRegistrationDiscountPercent(example.registrationDiscountPercent);
    if (example.recurringDiscountPercent !== undefined)
      setMonthlyDiscountPercent(example.recurringDiscountPercent);
    if (example.seasonFeeDiscountPercent !== undefined)
      setSeasonFeeDiscountPercent(example.seasonFeeDiscountPercent);

    // Solo aplicar isSinglePayment si no estamos forzados a SINGLE_ONLY
    if (example.isSinglePayment !== undefined && billingType !== "SINGLE_ONLY")
      setIsSinglePayment(example.isSinglePayment);

    if (example.advanceCycles !== undefined)
      setAdvanceCycles(Number(example.advanceCycles));
    if (example.promotionalCycles !== undefined)
      setPromotionalCycles(Number(example.promotionalCycles));
    if (example.advanceCyclesDiscountPercent !== undefined)
      setAdvanceCyclesDiscountPercent(
        String(example.advanceCyclesDiscountPercent),
      );

    examplesModalState.close();
  };

  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Alert status="accent" className="mb-2">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title className="flex items-center gap-2">
              Acerca de los Planes de Pago
            </Alert.Title>
            <Alert.Description>
              {billingType === "MONTHLY_ONLY"
                ? "Un plan de pago define las mensualidades y descuentos recurrentes o promociones por pagos adelantados para el atleta."
                : billingType === "SINGLE_ONLY"
                ? "Un plan de pago permite configurar los descuentos que obtendrán los atletas al pagar el costo total de la temporada por adelantado."
                : "Un plan de pago define cómo y cuándo se generarán los cobros recurrentes para el jugador. Permite establecer descuentos automáticos para incentivar pagos adelantados o por temporada completa."}
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <Alert
          status="accent"
          className="mb-4 bg-primary/10 border border-primary/20"
        >
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>
              ¿Necesitas inspiración o quieres ahorrar tiempo?
            </Alert.Title>
            <Alert.Description className="flex flex-col gap-3 mt-1">
              <p>
                Puedes explorar nuestras plantillas sugeridas y{" "}
                <strong>aplicar una configuración con un solo clic</strong>.
                Tenemos plantillas preconfiguradas para promociones 2x1, pagos
                trimestrales, becas completas y temporadas anuales.
              </p>
              <div>
                <Modal>
                  <Button
                    size="sm"
                    variant="primary"
                    className="h-8 px-4 text-xs font-semibold"
                    onPress={() => examplesModalState.open()}
                  >
                    Explorar y Aplicar Plantillas
                  </Button>
                  <ExamplesModal
                    isOpen={examplesModalState.isOpen}
                    onOpenChange={examplesModalState.setOpen}
                    onClose={() => examplesModalState.close()}
                    onApplyExample={applyExample}
                    billingType={billingType}
                  />
                </Modal>
              </div>
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <TextField
          isRequired
          className="w-full"
          name="name"
          type="text"
          isInvalid={!!errors.name || undefined}
        >
          <Label>Nombre</Label>
          <Input
            variant="secondary"
            value={name || ""}
            onChange={(e) => {
              setName(e.target.value || null);
              handleRemoveError("name");
            }}
            placeholder="Ingrese el nombre del plan de pago"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
          <Description className="text-xs text-muted-foreground mt-1">
            Ej: Regular, Beca Completa, Plan Hermanos, etc.
          </Description>
        </TextField>

        {billingType === "SINGLE_ONLY" ||
        (billingType !== "MONTHLY_ONLY" && isSinglePayment) ? (
          <TextField
            isRequired
            className="w-full"
            name="seasonFeeDiscountPercent"
            type="text"
            isInvalid={!!errors.seasonFeeDiscountPercent || undefined}
          >
            <Label>
              Descuento Tarifa de Temporada (%){" "}
              <InfoTooltip text="Descuento aplicado si el jugador paga toda la temporada en un solo pago al inicio." />
            </Label>
            <Input
              variant="secondary"
              min={0}
              max={100}
              placeholder="15"
              type="number"
              step={0.1}
              value={seasonFeeDiscountPercent || ""}
              onChange={(e) => {
                setSeasonFeeDiscountPercent(e.target.value || null);
                handleRemoveError("seasonFeeDiscountPercent");
              }}
            />
            <FieldError
              children={
                errors.seasonFeeDiscountPercent && (
                  <> {errors.seasonFeeDiscountPercent}</>
                )
              }
            />
            <Description className="text-xs text-muted-foreground mt-1">
              Porcentaje a descontar del costo total de la temporada (0 - 100).
            </Description>
          </TextField>
        ) : (
          <>
            <TextField
              isRequired
              className="w-full"
              name="registrationDiscountPercent"
              type="text"
              isInvalid={!!errors.registrationDiscountPercent || undefined}
            >
              <Label>
                Descuento Inscripción (%){" "}
                <InfoTooltip text="Descuento aplicado al cargo único de inscripción (Matrícula) al momento de registrarse en la temporada." />
              </Label>
              <Input
                variant="secondary"
                min={0}
                max={100}
                placeholder="12"
                type="number"
                step={0.1}
                value={registrationDiscountPercent || ""}
                onChange={(e) => {
                  setRegistrationDiscountPercent(e.target.value || null);
                  handleRemoveError("registrationDiscountPercent");
                }}
              />
              <FieldError
                children={
                  errors.registrationDiscountPercent && (
                    <> {errors.registrationDiscountPercent}</>
                  )
                }
              />
              <Description className="text-xs text-muted-foreground mt-1">
                Porcentaje a descontar del costo de la inscripción al equipo (0
                - 100).
              </Description>
            </TextField>
            <TextField
              isRequired
              className="w-full"
              name="recurringDiscountPercent"
              type="text"
              isInvalid={!!errors.recurringDiscountPercent || undefined}
            >
              <Label>
                Descuento Cuota Recurrente (%){" "}
                <InfoTooltip text="Descuento aplicado automáticamente a cada una de las cuotas recurrentes que se generen." />
              </Label>
              <Input
                variant="secondary"
                min={0}
                max={100}
                placeholder="12"
                type="number"
                step={0.1}
                value={recurringDiscountPercent || ""}
                onChange={(e) => {
                  setMonthlyDiscountPercent(e.target.value || null);
                  handleRemoveError("recurringDiscountPercent");
                }}
              />
              <FieldError
                children={
                  errors.recurringDiscountPercent && (
                    <> {errors.recurringDiscountPercent}</>
                  )
                }
              />
              <Description className="text-xs text-muted-foreground mt-1">
                Porcentaje a descontar de cada cuota recurrente (semanal,
                quincenal o mensual) (0 - 100).
              </Description>
            </TextField>
          </>
        )}

        {!(billingType === "SINGLE_ONLY" || isSinglePayment) && (
          <>
            <TextField
              isRequired
              className="w-full"
              name="advanceCycles"
              type="text"
              isInvalid={!!errors.advanceCycles || undefined}
            >
              <Label>
                Agrupar Cuotas (Pago Adelantado){" "}
                <InfoTooltip text="Agrupa múltiples meses en un solo recibo inicial. Ej: Si pones 2, al atleta se le cobrará el mes 1 y el mes 2 juntos en su primer día." />
              </Label>
              <Input
                variant="secondary"
                min={1}
                max={24}
                placeholder="1"
                type="number"
                step={1}
                value={advanceCycles?.toString() || "1"}
                onChange={(e) => {
                  setAdvanceCycles(parseInt(e.target.value) || 1);
                  handleRemoveError("advanceCycles");
                }}
              />
              <FieldError
                children={errors.advanceCycles && <> {errors.advanceCycles}</>}
              />
              <Description className="text-xs text-muted-foreground mt-1">
                Número de cuotas recurrentes que se cobrarán juntas en el recibo
                inicial (Ej: 2 para adelantar un mes). Mínimo 1.
              </Description>
            </TextField>

            <TextField
              isRequired
              className="w-full"
              name="promotionalCycles"
              type="text"
              isInvalid={!!errors.promotionalCycles || undefined}
            >
              <Label>
                Ciclos con Descuento{" "}
                <InfoTooltip text="¿A cuántas de las cuotas adelantadas se les aplicará el descuento? Ej: En un 2x1, agrupas 2 cuotas pero solo 1 tiene descuento." />
              </Label>
              <Input
                variant="secondary"
                min={1}
                max={advanceCycles}
                placeholder="1"
                type="number"
                step={1}
                value={promotionalCycles?.toString() || "1"}
                onChange={(e) => {
                  setPromotionalCycles(parseInt(e.target.value) || 1);
                  handleRemoveError("promotionalCycles");
                }}
              />
              <FieldError
                children={errors.promotionalCycles && <> {errors.promotionalCycles}</>}
              />
              <Description className="text-xs text-muted-foreground mt-1">
                Cantidad de cuotas (dentro de las adelantadas) que recibirán la rebaja promocional.
              </Description>
            </TextField>

            <TextField
              isRequired
              className="w-full"
              name="advanceCyclesDiscountPercent"
              type="text"
              isInvalid={!!errors.advanceCyclesDiscountPercent || undefined}
            >
              <Label>
                Descuento en Cuotas Adelantadas (%){" "}
                <InfoTooltip text="Aplica un descuento AL TOTAL de las cuotas agrupadas arriba. Ej: Agrupar 2 cuotas con 50% de descuento = Paga 1 mes y se le adelantan 2 (Promoción de inicio gratis)." />
              </Label>
              <Input
                variant="secondary"
                placeholder="0.00"
                type="text"
                value={advanceCyclesDiscountPercent}
                onChange={(e) => {
                  let val = e.target.value.replace(/[^0-9.]/g, "");
                  setAdvanceCyclesDiscountPercent(val);
                  handleRemoveError("advanceCyclesDiscountPercent");
                }}
              />
              <FieldError
                children={
                  errors.advanceCyclesDiscountPercent && (
                    <> {errors.advanceCyclesDiscountPercent}</>
                  )
                }
              />
              <Description className="text-xs text-muted-foreground mt-1">
                Porcentaje de descuento aplicado a las cuotas adelantadas
                seleccionadas arriba. Use 100 para que sean gratis.
              </Description>
            </TextField>
          </>
        )}

        <Switch
          isSelected={isDefault}
          onChange={setIsDefault}
          className="w-full max-w-full justify-between items-center py-2 flex-row-reverse"
        >
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <div className="flex flex-col">
              <Label className="text-sm text-foreground font-medium flex items-center">
                Marcar como plan por defecto
                <InfoTooltip text="Si marcas esto, este plan aparecerá preseleccionado al registrar un atleta." />
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Si está activo, este plan se seleccionará automáticamente cuando
                registres a un nuevo atleta en esta temporada.
              </p>
            </div>
          </Switch.Content>
        </Switch>

        {billingType === "BOTH" || !billingType ? (
          <Switch
            isSelected={isSinglePayment}
            onChange={setIsSinglePayment}
            className="w-full max-w-full justify-between items-center py-2 flex-row-reverse"
          >
            <Switch.Content>
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <div className="flex flex-col">
                <Label className="text-sm text-foreground font-medium flex items-center">
                  Obligar Pago Único (Toda la temporada por adelantado)
                  <InfoTooltip text="Fuerza a cobrar toda la temporada en un único pago al momento de inscripción." />
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Activa esto para cobrar toda la temporada en un solo pago
                  adelantado.
                </p>
              </div>
            </Switch.Content>
          </Switch>
        ) : null}
      </Form>
    </Surface>
  );
};
