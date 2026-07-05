import {
  Card,
  Description,
  FieldError,
  Input,
  InputGroup,
  Label,
  Radio,
  RadioGroup,
  TextField,
} from "@heroui/react";
import { Calendar02Icon, Payment01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import clsx from "clsx";

interface Props {
  registrationFee: string;
  setRegistrationFee: (value: string) => void;
  monthlyPrice: string;
  setMonthlyPrice: (value: string) => void;
  totalPrice: string;
  setTotalPrice: (value: string) => void;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const CardPayments = ({
  registrationFee,
  setRegistrationFee,
  monthlyPrice,
  setMonthlyPrice,
  totalPrice,
  setTotalPrice,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="col-span-12 p-8 xl:col-span-6 border-l-4 border-amber-900">
      <div className="flex items-center gap-4 mb-2">
        <HugeiconsIcon
          className="text-accent"
          icon={Payment01Icon}
          strokeWidth={2}
        />
        <Card.Header>
          <Card.Title className="text-xl font-bold">
            Modelo Financiero
          </Card.Title>
        </Card.Header>
      </div>
      <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextField
          className="w-full col-span-full"
          aria-label="Matrícula administrativa"
          defaultValue="0.00"
          variant="secondary"
          name="registrationFee"
          isInvalid={!!errors.registrationFee || undefined}
          value={registrationFee}
          onChange={(value) => setRegistrationFee(value)}
          onFocus={() => handleRemoveError("registrationFee")}
        >
          <Label>MATRICULA ADMINISTRATIVA</Label>
          <InputGroup>
            <InputGroup.Prefix>$</InputGroup.Prefix>
            <InputGroup.Input
              className="w-full"
              type="number"
              min={0}
              step={0.01}
            />
            <InputGroup.Suffix>BOB</InputGroup.Suffix>
          </InputGroup>
          <FieldError
            children={errors.registrationFee && <> {errors.registrationFee}</>}
          />
          {/* <Description>What customers would pay</Description> */}
        </TextField>

        <Card variant="secondary">
          <div className="flex items-center gap-4 mb-1">
            <HugeiconsIcon
              className="text-accent"
              icon={Calendar02Icon}
              strokeWidth={2}
            />
            <Card.Header>
              <Card.Title className="text-xl font-bold">
                MONTO MENSUAL
              </Card.Title>
            </Card.Header>
          </div>
          <Card.Content>
            <TextField
              className="w-full"
              aria-label="Monto mensual"
              defaultValue="0.00"
              variant="primary"
              name="monthlyPrice"
              isInvalid={!!errors.monthlyPrice || undefined}
              value={monthlyPrice}
              onChange={(value) => setMonthlyPrice(value)}
              onFocus={() => handleRemoveError("monthlyPrice")}
            >
              {/* <Label>MONTO / PRECIO TOTAL</Label> */}
              <InputGroup>
                <InputGroup.Prefix>$</InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full"
                  type="number"
                  min={0}
                  step={0.01}
                />
                <InputGroup.Suffix>BOB</InputGroup.Suffix>
              </InputGroup>
              <FieldError
                children={errors.monthlyPrice && <> {errors.monthlyPrice}</>}
              />
              <Description>
                El monto que pagará el cliente por cada mes de actividad
              </Description>
            </TextField>
          </Card.Content>
        </Card>
        <Card variant="secondary">
          <div className="flex items-center gap-4 mb-1">
            <HugeiconsIcon
              className="text-accent"
              icon={Payment01Icon}
              strokeWidth={2}
            />
            <Card.Header>
              <Card.Title className="text-xl font-bold">
                PAGO ÚNICO TOTAL
              </Card.Title>
            </Card.Header>
          </div>
          <Card.Content>
            <TextField
              className="w-full"
              aria-label="Pago único total"
              defaultValue="0.00"
              variant="primary"
              name="totalPrice"
              value={totalPrice}
              isInvalid={!!errors.totalPrice || undefined}
              onChange={(value) => setTotalPrice(value)}
              onFocus={() => handleRemoveError("totalPrice")}
            >
              {/* <Label>MONTO / PRECIO TOTAL</Label> */}
              <InputGroup>
                <InputGroup.Prefix>$</InputGroup.Prefix>
                <InputGroup.Input
                  className="w-full"
                  type="number"
                  min={0}
                  step={0.01}
                />
                <InputGroup.Suffix>BOB</InputGroup.Suffix>
              </InputGroup>
              <FieldError
                children={errors.totalPrice && <> {errors.totalPrice}</>}
              />
              <Description>
                El monto que pagará el cliente por la actividad completa
              </Description>
            </TextField>
          </Card.Content>
        </Card>
      </Card.Content>
    </Card>
  );
};
