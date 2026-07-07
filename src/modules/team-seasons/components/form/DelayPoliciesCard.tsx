import {
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  NumberField,
  Switch,
  TextField,
  Alert,
} from "@heroui/react";
import {
  MoneyExchange01Icon,
  PolicyIcon,
  TimerIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { Dispatch, SetStateAction, useEffect } from "react";

import { BillingFrequency } from "../../interfaces/team-season.interface";

interface Props {
  billingFrequency: BillingFrequency;
  lateFeePerDay: string | null;
  setLateFeePerDay: Dispatch<SetStateAction<string | null>>;
  graceDays: number | null;
  setGraceDays: Dispatch<SetStateAction<number | null>>;
  debtToleranceMonths: number | null;
  setDebtToleranceMonths: Dispatch<SetStateAction<number | null>>;
  lateFeeEnabled: boolean;
  setLateFeeEnabled: Dispatch<SetStateAction<boolean>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const DelayPoliciesCard = ({
  billingFrequency,
  lateFeePerDay,
  setLateFeePerDay,
  graceDays,
  setGraceDays,
  debtToleranceMonths,
  setDebtToleranceMonths,
  lateFeeEnabled,
  setLateFeeEnabled,
  errors,
  handleRemoveError,
}: Props) => {
  useEffect(() => {
    if (!lateFeeEnabled) {
      setDebtToleranceMonths(0);
      setLateFeePerDay("0");
      setGraceDays(0);
    }
  }, [lateFeeEnabled]);

  return (
    <Card className="lg:p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] relative overflow-hidden border border-l-4 border-l-danger">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-danger-soft  flex items-center justify-center">
            <HugeiconsIcon icon={PolicyIcon} className="text-danger" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Políticas de Mora y Suspensión
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Configura los parámetros de recargos y suspensión de membresía.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-full">
          <Alert status="accent" className="mb-2">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Motor de Recargos</Alert.Title>
              <Alert.Description>
                Si habilitas esta opción, el sistema penalizará automáticamente
                a los atletas que no paguen a tiempo una vez transcurridos los
                Días de Gracia permitidos, sumando el costo de Mora por cada día
                de retraso a su factura. Adicionalmente, puede suspender
                automáticamente membresías que excedan el límite de deudas.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        </div>
        <div className="col-span-full flex flex-col w-full gap-4">
          <Switch isSelected={lateFeeEnabled} onChange={setLateFeeEnabled}>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">Habilitar Recargos</Label>
            </Switch.Content>
          </Switch>
          {lateFeeEnabled && (
            <>
              <NumberField
                // isInvalid
                isRequired
                className="col-span-full"
                // formatOptions={{ style: "percent" }}
                variant="secondary"
                // maxValue={100}
                minValue={0}
                name="debtToleranceMonths"
                step={1}
                value={
                  debtToleranceMonths !== null
                    ? +debtToleranceMonths
                    : undefined
                }
                onChange={(v) => {
                  setDebtToleranceMonths(isNaN(v) ? null : v);
                  handleRemoveError("debtToleranceMonths");
                }}
              >
                <Label className="flex items-center gap-2 text-sm font-label font-bold">
                  <HugeiconsIcon icon={UnavailableIcon} />
                  Ciclos de Mora para Suspensión (
                  {billingFrequency === "WEEKLY"
                    ? "Semanas"
                    : billingFrequency === "BIWEEKLY"
                      ? "Quincenas"
                      : billingFrequency === "MONTHLY"
                        ? "Meses"
                        : "Ciclos"}
                  )
                </Label>
                <NumberField.Group>
                  <NumberField.DecrementButton />
                  <NumberField.Input />
                  <NumberField.IncrementButton />
                </NumberField.Group>
                <FieldError
                  children={
                    errors.debtToleranceMonths && (
                      <> {errors.debtToleranceMonths}</>
                    )
                  }
                />
                <Description className="text-xs text-muted-foreground mt-1">
                  Cantidad de{" "}
                  <b>
                    {billingFrequency === "WEEKLY"
                      ? "semanas"
                      : billingFrequency === "BIWEEKLY"
                        ? "quincenas"
                        : billingFrequency === "MONTHLY"
                          ? "meses"
                          : "ciclos"}{" "}
                    calendario completos
                  </b>{" "}
                  de atraso permitidos antes de suspender al atleta. (Ej. 2
                  significa que se suspenderá si debe más de 2{" "}
                  {billingFrequency === "WEEKLY"
                    ? "semanas"
                    : billingFrequency === "BIWEEKLY"
                      ? "quincenas"
                      : billingFrequency === "MONTHLY"
                        ? "meses"
                        : "ciclos"}{" "}
                  de su cuota base).
                </Description>
              </NumberField>
              <div className="flex flex-row gap-4">
                <TextField
                  isRequired
                  variant="secondary"
                  className="w-full"
                  name="lateFeePerDay"
                  type="text"
                  isInvalid={!!errors.recurringFee || undefined}
                >
                  <Label className="flex items-center gap-2 text-sm font-label font-bold">
                    <HugeiconsIcon icon={MoneyExchange01Icon} />
                    Recargo por día
                  </Label>
                  <InputGroup>
                    <InputGroup.Prefix>$</InputGroup.Prefix>
                    <InputGroup.Input
                      min={0}
                      step="0.01"
                      placeholder="0.00"
                      type="number"
                      value={lateFeePerDay || ""}
                      onChange={(e) => {
                        setLateFeePerDay(
                          e.target.value === "" ? null : e.target.value,
                        );
                        handleRemoveError("lateFeePerDay");
                      }}
                    />
                    <InputGroup.Suffix>Bs.</InputGroup.Suffix>
                  </InputGroup>
                  <FieldError
                    children={
                      errors.lateFeePerDay && <> {errors.lateFeePerDay}</>
                    }
                  />
                  <Description className="text-xs text-muted-foreground mt-1">
                    Monto extra diario cobrado al estar vencida la cuota
                    recurrente.
                  </Description>
                </TextField>

                <NumberField
                  // isInvalid
                  isRequired
                  // formatOptions={{ style: "percent" }}
                  variant="secondary"
                  // maxValue={100}
                  minValue={0}
                  name="graceDays"
                  step={1}
                  value={graceDays !== null ? +graceDays : undefined}
                  onChange={(v) => {
                    setGraceDays(isNaN(v) ? null : v);
                    handleRemoveError("graceDays");
                  }}
                >
                  <Label className="flex items-center gap-2 text-sm font-label font-bold">
                    <HugeiconsIcon icon={TimerIcon} />
                    Días de Gracia
                  </Label>
                  <NumberField.Group>
                    <NumberField.DecrementButton />
                    <NumberField.Input />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                  <FieldError
                    children={errors.graceDays && <> {errors.graceDays}</>}
                  />
                  <Description className="text-xs text-muted-foreground mt-1">
                    Días de tolerancia tras la fecha de pago antes de aplicar
                    multa.
                  </Description>
                </NumberField>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
