import {
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  NumberField,
  TextField,
} from "@heroui/react";
import { Money03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  registrationFee: string | null;
  setRegistrationFee: Dispatch<SetStateAction<string | null>>;
  recurringFee: string | null;
  setRecurringFee: Dispatch<SetStateAction<string | null>>;
  fullPaymentDiscountPercent: string | null;
  setFullPaymentDiscountPercent: Dispatch<SetStateAction<string | null>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const FinancialStructureCard = ({
  registrationFee,
  setRegistrationFee,
  recurringFee,
  setRecurringFee,
  fullPaymentDiscountPercent,
  setFullPaymentDiscountPercent,
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
          name="recurringFee"
          type="text"
          isInvalid={!!errors.recurringFee || undefined}
        >
          <Label>Mensualidad</Label>
          <InputGroup>
            <InputGroup.Prefix>$</InputGroup.Prefix>
            <InputGroup.Input
              min={0}
              step="0.01"
              placeholder="0.00"
              type="number"
              value={recurringFee || ""}
              onChange={(e) => {
                setRecurringFee(e.target.value === "" ? null : e.target.value);
                handleRemoveError("recurringFee");
              }}
            />
            <InputGroup.Suffix>Bs.</InputGroup.Suffix>
          </InputGroup>
          <FieldError
            children={errors.recurringFee && <> {errors.recurringFee}</>}
          />
        </TextField>
        <NumberField
          // isInvalid
          isRequired
          formatOptions={{ style: "percent" }}
          variant="secondary"
          maxValue={100}
          minValue={0}
          name="percentage"
          step={0.01}
          value={
            fullPaymentDiscountPercent ? +fullPaymentDiscountPercent : undefined
          }
          onChange={(v) => {
            setFullPaymentDiscountPercent(isNaN(v) ? null : v.toString());
            handleRemoveError("fullPaymentDiscountPercent");
          }}
        >
          <Label>Porcentaje Descuento Pago Total</Label>
          <NumberField.Group>
            <NumberField.DecrementButton />
            <NumberField.Input />
            <NumberField.IncrementButton />
          </NumberField.Group>
          <FieldError
            children={
              errors.fullPaymentDiscountPercent && (
                <> {errors.fullPaymentDiscountPercent}</>
              )
            }
          />
          <Description>
            Porcentaje de descuento a aplicar a la mensualidad por pago total.
            <br />
            Mensualidad a pagar:{" "}
            {recurringFee && fullPaymentDiscountPercent
              ? (
                  +recurringFee -
                  +recurringFee * +fullPaymentDiscountPercent
                ).toFixed(2)
              : recurringFee || 0}
          </Description>
        </NumberField>
        {/* <div className="bg-tertiary-fixed/30 p-6 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm text-on-tertiary-container">
              Descuento Pago Total
            </span>
            <span className="font-headline font-black text-tertiary text-lg">
              15%
            </span>
          </div>
          <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-[15%]"></div>
          </div>
          <p className="text-[10px] text-on-surface-variant italic">
            Aplicable para pagos realizados antes del inicio de temporada.
          </p>
        </div> */}
      </div>
    </Card>
  );
};
