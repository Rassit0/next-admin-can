import {
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  NumberField,
  TextField,
} from "@heroui/react";
import { Money03Icon, UnavailableIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  registrationFee: string | null;
  setRegistrationFee: Dispatch<SetStateAction<string | null>>;
  monthlyFee: string | null;
  setMonthlyFee: Dispatch<SetStateAction<string | null>>;
  billingDay: number | null;
  setBillingDay: Dispatch<SetStateAction<number | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const FinancialStructureCard = ({
  registrationFee,
  setRegistrationFee,
  monthlyFee,
  setMonthlyFee,
  billingDay,
  setBillingDay,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] relative overflow-hidden border border-l-4 border-l-tertiary">
      <Card.Header className="flex flex-row items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center">
          <HugeiconsIcon icon={Money03Icon} className="text-warning" />
        </div>
        <Card.Title className="font-headline font-bold text-lg">
          Estructura Financiera
        </Card.Title>
      </Card.Header>
      <div className="space-y-6">
        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="registrationFee"
          type="text"
          isInvalid={!!errors.registrationFee || undefined}
        >
          <Label>Matricula</Label>
          <InputGroup>
            <InputGroup.Prefix>$</InputGroup.Prefix>
            <InputGroup.Input
              min={0}
              step="0.01"
              placeholder="0.00"
              type="number"
              value={registrationFee || ""}
              onChange={(e) => {
                setRegistrationFee(
                  e.target.value === "" ? null : e.target.value,
                );
                handleRemoveError("registrationFee");
              }}
            />
            <InputGroup.Suffix>Bs.</InputGroup.Suffix>
          </InputGroup>
          <FieldError
            children={errors.registrationFee && <> {errors.registrationFee}</>}
          />
        </TextField>
        <TextField
          isRequired
          variant="secondary"
          className="w-full"
          name="monthlyFee"
          type="text"
          isInvalid={!!errors.monthlyFee || undefined}
        >
          <Label>Mensualidad</Label>
          <InputGroup>
            <InputGroup.Prefix>$</InputGroup.Prefix>
            <InputGroup.Input
              min={0}
              step="0.01"
              placeholder="0.00"
              type="number"
              value={monthlyFee || ""}
              onChange={(e) => {
                setMonthlyFee(e.target.value === "" ? null : e.target.value);
                handleRemoveError("monthlyFee");
              }}
            />
            <InputGroup.Suffix>Bs.</InputGroup.Suffix>
          </InputGroup>
          <FieldError
            children={errors.monthlyFee && <> {errors.monthlyFee}</>}
          />
        </TextField>

        <NumberField
          // isInvalid
          isRequired
          className="col-span-full"
          // formatOptions={{ style: "percent" }}
          variant="secondary"
          // maxValue={100}
          minValue={0}
          name="billingDay"
          step={1}
          value={billingDay !== null ? +billingDay : undefined}
          onChange={(v) => {
            setBillingDay(isNaN(v) ? null : v);
            handleRemoveError("billingDay");
          }}
        >
          <Label className="flex items-center gap-2 text-sm font-label font-bold">
            <HugeiconsIcon icon={UnavailableIcon} />
            Día de Facturación
          </Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
          <FieldError
            children={errors.billingDay && <> {errors.billingDay}</>}
          />
          <Description>Día del mes en que se genera la factura</Description>
        </NumberField>
      </div>
    </Card>
  );
};
