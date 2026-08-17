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

import { BillingFrequency } from "../../interfaces/course-season.interface";

interface Props {
  billingFrequency: BillingFrequency;
  lateFeePerDay: string | null;
  setLateFeePerDay: Dispatch<SetStateAction<string | null>>;
  graceDays: number | null;
  setGraceDays: Dispatch<SetStateAction<number | null>>;
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
  lateFeeEnabled,
  setLateFeeEnabled,
  errors,
  handleRemoveError,
}: Props) => {
  useEffect(() => {
    if (!lateFeeEnabled) {
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
              Políticas de Mora
            </h3>
            <p className="text-xs text-on-surface-variant font-medium">
              Aplica recargos por mora en la compra o pago de los ciclos vencidos.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-full">
          <Alert status="accent" className="mb-2">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Configuración de Recargos</Alert.Title>
              <Alert.Description>
                Si habilitas esta opción, podrás aplicar recargos por mora de
                forma explícita a los atletas que se atrasen en sus pagos de
                ciclos, sumando el costo de Mora por cada día de retraso.
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
              <Label className="text-sm">Habilitar Mora (Aplicación Explícita)</Label>
            </Switch.Content>
          </Switch>
          {lateFeeEnabled && (
            <div className="flex flex-col lg:flex-row gap-4">
              <TextField
                isRequired
                variant="secondary"
                className="w-full"
                name="lateFeePerDay"
                type="text"
                isInvalid={!!errors.lateFeePerDay || undefined}
              >
                <Label className="flex items-center gap-2 text-sm font-label font-bold">
                  <HugeiconsIcon icon={MoneyExchange01Icon} />
                  Monto de recargo diario
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
                  Monto extra diario cobrado al estar vencido el pago.
                </Description>
              </TextField>

              <NumberField
                isRequired
                variant="secondary"
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
                  Días de gracia
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
          )}
        </div>
      </div>
    </Card>
  );
};
