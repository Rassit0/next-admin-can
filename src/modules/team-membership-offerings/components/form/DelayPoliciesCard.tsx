import {
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  NumberField,
  Switch,
  TextField,
} from "@heroui/react";
import {
  MoneyExchange01Icon,
  PolicyIcon,
  TimerIcon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  lateFeePerDay: string | null;
  setLateFeePerDay: Dispatch<SetStateAction<string | null>>;
  graceDays: number | null;
  setGraceDays: Dispatch<SetStateAction<number | null>>;
  suspensionAfterMonthsDue: number | null;
  setSuspensionAfterMonthsDue: Dispatch<SetStateAction<number | null>>;
  lateFeeEnabled: boolean;
  setLateFeeEnabled: Dispatch<SetStateAction<boolean>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const DelayPoliciesCard = ({
  lateFeePerDay,
  setLateFeePerDay,
  graceDays,
  setGraceDays,
  suspensionAfterMonthsDue,
  setSuspensionAfterMonthsDue,
  lateFeeEnabled,
  setLateFeeEnabled,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] relative overflow-hidden border border-l-4 border-l-danger">
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
              Configura los límites de recargos y vigencia de membresía.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low px-6 py-3 rounded-full">
          <Switch isSelected={lateFeeEnabled} onChange={setLateFeeEnabled}>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Content>
              <Label className="text-sm">Habilitar Recargos</Label>
            </Switch.Content>
          </Switch>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="lateFeePerDay"
          type="text"
          isInvalid={!!errors.monthlyFee || undefined}
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
                setLateFeePerDay(e.target.value === "" ? null : e.target.value);
                handleRemoveError("lateFeePerDay");
              }}
            />
            <InputGroup.Suffix>Bs.</InputGroup.Suffix>
          </InputGroup>
          <FieldError
            children={errors.lateFeePerDay && <> {errors.lateFeePerDay}</>}
          />
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
          <FieldError children={errors.graceDays && <> {errors.graceDays}</>} />
          <Description>
            Días de gracia para el pago de la mensualidad
          </Description>
        </NumberField>

        <NumberField
          // isInvalid
          isRequired
          // formatOptions={{ style: "percent" }}
          variant="secondary"
          // maxValue={100}
          minValue={0}
          name="suspensionAfterMonthsDue"
          step={1}
          value={
            suspensionAfterMonthsDue !== null
              ? +suspensionAfterMonthsDue
              : undefined
          }
          onChange={(v) => {
            setSuspensionAfterMonthsDue(isNaN(v) ? null : v);
            handleRemoveError("suspensionAfterMonthsDue");
          }}
        >
          <Label className="flex items-center gap-2 text-sm font-label font-bold">
            <HugeiconsIcon icon={UnavailableIcon} />
            Suspensión Automática
          </Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
          <FieldError
            children={
              errors.suspensionAfterMonthsDue && (
                <> {errors.suspensionAfterMonthsDue}</>
              )
            }
          />
          <Description>
            Meses de mora para la suspensión del miembro
          </Description>
        </NumberField>
      </div>
    </Card>
  );
};
