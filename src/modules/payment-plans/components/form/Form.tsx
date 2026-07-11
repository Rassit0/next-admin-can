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
} from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import React, { useCallback, useState } from "react";
import {
  addPaymentPlan,
  editPaymentPlan,
  IPaymentPlan,
} from "@/modules/payment-plans";

interface Props {
  paymentPlan?: IPaymentPlan;
  teamSeasonId: string;
  teamSeasonBillingType?: string;
  formId: string;
  onSubmited?: () => void;
  isLoading?: boolean;
  setIsLoading?: (value: boolean) => void;
}
export const FormPaymentPlan = ({
  paymentPlan,
  teamSeasonId,
  teamSeasonBillingType,
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

  const [isDefault, setIsDefault] = useState<boolean>(
    paymentPlan?.isDefault || false,
  );
  const [isSinglePayment, setIsSinglePayment] = useState<boolean>(
    teamSeasonBillingType === "SINGLE_ONLY"
      ? true
      : paymentPlan?.isSinglePayment || false,
  );
  const [advanceCycles, setAdvanceCycles] = useState<number>(
    paymentPlan?.advanceCycles || 1,
  );
  const [advanceCyclesDiscountPercent, setAdvanceCyclesDiscountPercent] =
    useState<string>(
      paymentPlan?.advanceCyclesDiscountPercent?.toString() || "0",
    );

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
    if (teamSeasonBillingType === "SINGLE_ONLY") {
      if (!seasonFeeDiscountPercent) {
        newErrors.seasonFeeDiscountPercent =
          "Debe ingresar un descuento para la temporada";
      } else if (isInvalidPercent(season)) {
        newErrors.seasonFeeDiscountPercent = "El porcentaje debe estar entre 0 y 100";
      }
      registration = "0";
      recurring = "0";
    } else if (teamSeasonBillingType === "MONTHLY_ONLY") {
      if (!registrationDiscountPercent) {
        newErrors.registrationDiscountPercent =
          "Debe ingresar un descuento de inscripción";
      } else if (isInvalidPercent(registration)) {
        newErrors.registrationDiscountPercent = "El porcentaje debe estar entre 0 y 100";
      }
      
      if (!recurringDiscountPercent) {
        newErrors.recurringDiscountPercent =
          "Debe ingresar un descuento de cuota recurrente";
      } else if (isInvalidPercent(recurring)) {
        newErrors.recurringDiscountPercent = "El porcentaje debe estar entre 0 y 100";
      }
      season = "0";
    } else {
      // BOTH
      if (isSinglePayment) {
        if (!seasonFeeDiscountPercent) {
          newErrors.seasonFeeDiscountPercent =
            "Debe ingresar un descuento para la temporada";
        } else if (isInvalidPercent(season)) {
          newErrors.seasonFeeDiscountPercent = "El porcentaje debe estar entre 0 y 100";
        }
        registration = "0";
        recurring = "0";
      } else {
        if (!registrationDiscountPercent) {
          newErrors.registrationDiscountPercent =
            "Debe ingresar un descuento de inscripción";
        } else if (isInvalidPercent(registration)) {
          newErrors.registrationDiscountPercent = "El porcentaje debe estar entre 0 y 100";
        }
        
        if (!recurringDiscountPercent) {
          newErrors.recurringDiscountPercent =
            "Debe ingresar un descuento de cuota recurrente";
        } else if (isInvalidPercent(recurring)) {
          newErrors.recurringDiscountPercent = "El porcentaje debe estar entre 0 y 100";
        }
        
        if (advanceCycles < 1)
          newErrors.advanceCycles = "Debe agrupar al menos 1 cuota";
        if (isInvalidPercent(advanceCyclesDiscountPercent)) {
          newErrors.advanceCyclesDiscountPercent =
            "El porcentaje debe estar entre 0 y 100";
        }
        season = "0";
      }
    }

    if (teamSeasonBillingType === "MONTHLY_ONLY") {
      if (advanceCycles < 1)
        newErrors.advanceCycles = "Debe agrupar al menos 1 cuota";
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
      name: name!,
      registrationDiscountPercent: registration,
      recurringDiscountPercent: recurring,
      seasonFeeDiscountPercent: season,
      isDefault,
      isSinglePayment,
      advanceCycles:
        isSinglePayment || teamSeasonBillingType === "SINGLE_ONLY"
          ? 1
          : advanceCycles,
      advanceCyclesDiscountPercent:
        isSinglePayment || teamSeasonBillingType === "SINGLE_ONLY"
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
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Alert status="accent" className="mb-2">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Información del Plan de Pago</Alert.Title>
            <Alert.Description>
              Un plan de pago define cómo y cuándo se generarán los cobros
              recurrentes para el jugador. Permite establecer descuentos
              automáticos para incentivar pagos adelantados o por temporada
              completa.
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
            placeholder="Ingrese el nombre del rol"
          />
          <FieldError children={errors.name && <> {errors.name}</>} />
          <Description className="text-xs text-muted-foreground mt-1">
            Ej: Regular, Beca Completa, Plan Hermanos, etc.
          </Description>
        </TextField>

        {teamSeasonBillingType === "SINGLE_ONLY" ||
        (teamSeasonBillingType !== "MONTHLY_ONLY" && isSinglePayment) ? (
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

        {!(teamSeasonBillingType === "SINGLE_ONLY" || isSinglePayment) && (
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
                <InfoTooltip text="Número de cuotas recurrentes que se cobran de una sola vez por adelantado (ej. 3 para pago trimestral). Mínimo 1." />
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
                Número de cuotas recurrentes que se cobrarán juntas en un solo
                cargo (ej. 3 para pago trimestral). Mínimo 1.
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
                <InfoTooltip text="Porcentaje de descuento aplicado al total del bloque de cuotas adelantadas. Remplaza el antiguo concepto de 'meses gratis'." />
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
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Content>
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

        <Switch
          isSelected={isSinglePayment}
          isDisabled={teamSeasonBillingType === "SINGLE_ONLY"}
          onChange={setIsSinglePayment}
          className="w-full max-w-full justify-between items-center py-2 flex-row-reverse"
        >
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Content>
            <div className="flex flex-col">
              <Label className="text-sm text-foreground font-medium flex items-center">
                Obligar Pago Único (Toda la temporada por adelantado)
                <InfoTooltip text="Fuerza a cobrar toda la temporada en un único pago al momento de inscripción." />
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Activa esto para cobrar toda la temporada en un solo pago
                adelantado. En temporadas recurrentes, sumará todas las cuotas
                del ciclo con sus descuentos. En temporadas de pago único, usará
                la Tarifa de Temporada.
              </p>
            </div>
          </Switch.Content>
        </Switch>
      </Form>
    </Surface>
  );
};
