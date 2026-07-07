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
} from "@heroui/react";
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
    teamSeasonBillingType === "SINGLE_ONLY" ? true : (paymentPlan?.isSinglePayment || false),
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

    // Validations based on visible fields
    if (teamSeasonBillingType === "SINGLE_ONLY") {
      if (!seasonFeeDiscountPercent) newErrors.seasonFeeDiscountPercent = "Debe ingresar un descuento para la temporada";
      registration = "0";
      recurring = "0";
    } else if (teamSeasonBillingType === "MONTHLY_ONLY") {
      if (!registrationDiscountPercent) newErrors.registrationDiscountPercent = "Debe ingresar un descuento de inscripción";
      if (!recurringDiscountPercent) newErrors.recurringDiscountPercent = "Debe ingresar un descuento de cuota recurrente";
      season = "0";
    } else {
      // BOTH
      if (isSinglePayment) {
        if (!seasonFeeDiscountPercent) newErrors.seasonFeeDiscountPercent = "Debe ingresar un descuento para la temporada";
        registration = "0";
        recurring = "0";
      } else {
        if (!registrationDiscountPercent) newErrors.registrationDiscountPercent = "Debe ingresar un descuento de inscripción";
        if (!recurringDiscountPercent) newErrors.recurringDiscountPercent = "Debe ingresar un descuento de cuota recurrente";
        season = "0";
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

  return (
    <Surface variant="transparent">
      <Form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
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

        {(teamSeasonBillingType === "SINGLE_ONLY" || (teamSeasonBillingType !== "MONTHLY_ONLY" && isSinglePayment)) ? (
          <TextField
            isRequired
            className="w-full"
            name="seasonFeeDiscountPercent"
            type="text"
            isInvalid={!!errors.seasonFeeDiscountPercent || undefined}
          >
            <Label>Descuento Tarifa de Temporada (%)</Label>
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
              <Label>Descuento Inscripción (%)</Label>
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
                Porcentaje a descontar del costo de la inscripción al equipo (0 - 100).
              </Description>
            </TextField>
            <TextField
              isRequired
              className="w-full"
              name="recurringDiscountPercent"
              type="text"
              isInvalid={!!errors.recurringDiscountPercent || undefined}
            >
              <Label>Descuento Cuota Recurrente (%)</Label>
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
                Porcentaje a descontar de cada cuota recurrente (semanal, quincenal o mensual) (0 - 100).
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
              <Label className="text-sm text-foreground font-medium">
                Marcar como plan por defecto
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Si está activo, este plan se seleccionará automáticamente cuando registres a un nuevo atleta en esta temporada.
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
              <Label className="text-sm text-foreground font-medium">
                Obligar Pago Único (Toda la temporada por adelantado)
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                Activa esto para cobrar toda la temporada en un solo pago adelantado. En temporadas recurrentes, sumará todas las cuotas del ciclo con sus descuentos. En temporadas de pago único, usará la Tarifa de Temporada.
              </p>
            </div>
          </Switch.Content>
        </Switch>
      </Form>
    </Surface>
  );
};
