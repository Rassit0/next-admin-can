import {
  Card,
  Description,
  FieldError,
  InputGroup,
  Label,
  NumberField,
  TextField,
  Select,
  ListBox,
  Switch,
  Alert,
} from "@heroui/react";
import { Money03Icon, UnavailableIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Dispatch, SetStateAction } from "react";
import {
  SeasonBillingType,
  BillingFrequency,
} from "../../interfaces/course-season.interface";

interface Props {
  registrationFee: string | null;
  setRegistrationFee: Dispatch<SetStateAction<string | null>>;
  recurringFee: string | null;
  setRecurringFee: Dispatch<SetStateAction<string | null>>;
  seasonFee: string | null;
  setSeasonFee: Dispatch<SetStateAction<string | null>>;
  billingType: SeasonBillingType;
  setBillingType: Dispatch<SetStateAction<SeasonBillingType>>;
  billingFrequency: BillingFrequency;
  setBillingFrequency: Dispatch<SetStateAction<BillingFrequency>>;
  billingDay: number | null;
  setBillingDay: Dispatch<SetStateAction<number | null>>;
  prorateFirstRecurringFee: boolean;
  setProrateFirstRecurringFee: Dispatch<SetStateAction<boolean>>;
  prorateLastRecurringFee: boolean;
  setProrateLastRecurringFee: Dispatch<SetStateAction<boolean>>;
  prorateRegistrationFee: boolean;
  setProrateRegistrationFee: Dispatch<SetStateAction<boolean>>;
  prorateSeasonFee: boolean;
  setProrateSeasonFee: Dispatch<SetStateAction<boolean>>;
  errors: Record<string, string>;
  handleRemoveError: (fieldName: string) => void;
}
export const FinancialStructureCard = ({
  registrationFee,
  setRegistrationFee,
  recurringFee,
  setRecurringFee,
  seasonFee,
  setSeasonFee,
  billingType,
  setBillingType,
  billingFrequency,
  setBillingFrequency,
  billingDay,
  setBillingDay,
  prorateFirstRecurringFee,
  setProrateFirstRecurringFee,
  prorateLastRecurringFee,
  setProrateLastRecurringFee,
  prorateRegistrationFee,
  setProrateRegistrationFee,
  prorateSeasonFee,
  setProrateSeasonFee,
  errors,
  handleRemoveError,
}: Props) => {
  return (
    <Card className="lg:p-8 shadow-[0px_12px_32px_rgba(25,28,29,0.06)] relative overflow-hidden border border-l-4 border-l-tertiary">
      <Card.Header className="flex flex-row items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-warning-soft flex items-center justify-center">
          <HugeiconsIcon icon={Money03Icon} className="text-warning" />
        </div>
        <Card.Title className="font-headline font-bold text-lg">
          Estructura Financiera
        </Card.Title>
      </Card.Header>
      <div className="space-y-6">
        <Alert status="accent" className="mb-2">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Cobros Automatizados</Alert.Title>
            <Alert.Description>
              Configura cómo el sistema facturará automáticamente a los atletas
              de esta temporada. El modelo de facturación determina si se cobra
              cada ciclo de tiempo o si se hace un único pago por adelantado.
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <Select
          isRequired
          className="w-full"
          name="billingType"
          placeholder="Seleccione el modelo de cobro"
          variant="secondary"
          isInvalid={!!errors.billingType || undefined}
          value={billingType}
          onChange={(key) => {
            setBillingType(key ? (key as SeasonBillingType) : "MONTHLY_ONLY");
            handleRemoveError("billingType");
          }}
        >
          <Label>Modelo de Facturación</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item
                id="MONTHLY_ONLY"
                textValue="Pago Recurrente (Según Frecuencia)"
              >
                Pago Recurrente (Según Frecuencia)
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item
                id="SINGLE_ONLY"
                textValue="Pago Único (Toda la temporada)"
              >
                Pago Único (Toda la temporada)
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item
                id="BOTH"
                textValue="Ambos (A elección del cliente)"
              >
                Ambos (A elección del cliente)
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
          <FieldError
            children={errors.billingType && <> {errors.billingType}</>}
          />
          <Description className="text-xs text-muted-foreground mt-1">
            <b>Recurrente:</b> genera cobros iterativos (semanal, quincenal, o
            mensual). <br />
            <b>Único:</b> cobra el valor de toda la temporada por adelantado.{" "}
            <br />
            <b>Ambos:</b> permite al cliente elegir su modalidad al inscribirse.
          </Description>
        </Select>

        {billingType !== "SINGLE_ONLY" && (
          <Select
            isRequired
            className="w-full"
            name="billingFrequency"
            placeholder="Seleccione la frecuencia de cobro"
            variant="secondary"
            isInvalid={!!errors.billingFrequency || undefined}
            value={billingFrequency}
            onChange={(key) => {
              setBillingFrequency(key ? (key as BillingFrequency) : "MONTHLY");
              handleRemoveError("billingFrequency");
            }}
          >
            <Label>Frecuencia de Facturación</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="MONTHLY" textValue="Mensual (Cada mes)">
                  Mensual (Cada mes)
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item
                  id="BIWEEKLY"
                  textValue="Quincenal (Cada 14 días)"
                >
                  Quincenal (Cada 14 días)
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="WEEKLY" textValue="Semanal (Cada 7 días)">
                  Semanal (Cada 7 días)
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
            <FieldError
              children={
                errors.billingFrequency && <> {errors.billingFrequency}</>
              }
            />
            <Description className="text-xs text-muted-foreground mt-1">
              Determina cada cuánto tiempo el sistema generará automáticamente
              un nuevo cobro por el valor de la Cuota Base.
            </Description>
          </Select>
        )}

        {billingType !== "SINGLE_ONLY" && (
          <TextField
            isRequired
            variant="secondary"
            className="w-full"
            name="registrationFee"
            type="text"
            isInvalid={!!errors.registrationFee || undefined}
          >
            <Label>Matrícula</Label>
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
              children={
                errors.registrationFee && <> {errors.registrationFee}</>
              }
            />
            <Description className="text-xs text-muted-foreground mt-1">
              Costo inicial y único cobrado al momento de inscribir al atleta.
            </Description>
          </TextField>
        )}
        {billingType !== "SINGLE_ONLY" && (
          <TextField
            isRequired
            variant="secondary"
            className="w-full"
            name="recurringFee"
            type="text"
            isInvalid={!!errors.recurringFee || undefined}
          >
            <Label>
              Cuota Base (
              {billingFrequency === "WEEKLY"
                ? "Semanal"
                : billingFrequency === "BIWEEKLY"
                  ? "Quincenal"
                  : "Mensual"}
              )
            </Label>
            <InputGroup>
              <InputGroup.Prefix>$</InputGroup.Prefix>
              <InputGroup.Input
                min={0}
                step="0.01"
                placeholder="0.00"
                type="number"
                value={recurringFee || ""}
                onChange={(e) => {
                  setRecurringFee(
                    e.target.value === "" ? null : e.target.value,
                  );
                  handleRemoveError("recurringFee");
                }}
              />
              <InputGroup.Suffix>Bs.</InputGroup.Suffix>
            </InputGroup>
            <FieldError
              children={errors.recurringFee && <> {errors.recurringFee}</>}
            />
            <Description className="text-xs text-muted-foreground mt-1">
              Cuota base recurrente que se cobrará cada ciclo.
            </Description>
          </TextField>
        )}

        {(billingType === "SINGLE_ONLY" || billingType === "BOTH") && (
          <TextField
            isRequired
            variant="secondary"
            className="w-full"
            name="seasonFee"
            type="text"
            isInvalid={!!errors.seasonFee || undefined}
          >
            <Label>Tarifa de Temporada (Pago Único)</Label>
            <InputGroup>
              <InputGroup.Prefix>$</InputGroup.Prefix>
              <InputGroup.Input
                min={0}
                step="0.01"
                placeholder="0.00"
                type="number"
                value={seasonFee || ""}
                onChange={(e) => {
                  setSeasonFee(e.target.value === "" ? null : e.target.value);
                  handleRemoveError("seasonFee");
                }}
              />
              <InputGroup.Suffix>Bs.</InputGroup.Suffix>
            </InputGroup>
            <FieldError
              children={errors.seasonFee && <> {errors.seasonFee}</>}
            />
            <Description className="text-xs text-muted-foreground mt-1">
              Monto total que se cobrará si el atleta decide pagar la temporada
              completa de golpe.
            </Description>
          </TextField>
        )}

        {billingType !== "SINGLE_ONLY" && billingFrequency === "MONTHLY" && (
          <NumberField
            isRequired
            className="col-span-full"
            variant="secondary"
            minValue={1}
            maxValue={28}
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
              Día de Facturación Mensual
            </Label>
            <NumberField.Group>
              <NumberField.DecrementButton />
              <NumberField.Input />
              <NumberField.IncrementButton />
            </NumberField.Group>
            <FieldError
              children={errors.billingDay && <> {errors.billingDay}</>}
            />
            <Description className="text-xs text-muted-foreground mt-1">
              El día del mes (1 al 28) en que el sistema generará
              automáticamente los cargos para los inscritos en esta temporada.
            </Description>
          </NumberField>
        )}

        <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-secondary">
          <Label className="font-headline font-bold">
            Opciones de Prorrateo
          </Label>

          <Alert status="accent">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Cálculos Proporcionales (Prorrateos)</Alert.Title>
              <Alert.Description>
                Activa estas opciones para que el motor de pagos asigne montos
                justos en función del día exacto en que el atleta inicie o
                termine su membresía.
                <br />
                <strong>Ejemplo:</strong> Si la cuota mensual es de 100 Bs. y el
                atleta se inscribe a mitad del mes, el sistema le generará
                automáticamente un cargo de 50 Bs.
              </Alert.Description>
            </Alert.Content>
          </Alert>

          {billingType !== "SINGLE_ONLY" && (
            <>
              <Switch
                isSelected={prorateFirstRecurringFee}
                onChange={setProrateFirstRecurringFee}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Content>
                  <span className="text-sm">
                    Prorratear primera cuota recurrente (si no es ciclo
                    completo)
                  </span>
                </Switch.Content>
              </Switch>
              <Switch
                isSelected={prorateLastRecurringFee}
                onChange={setProrateLastRecurringFee}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Content>
                  <span className="text-sm">
                    Prorratear última cuota recurrente (al finalizar temporada)
                  </span>
                </Switch.Content>
              </Switch>
              <Switch
                isSelected={prorateRegistrationFee}
                onChange={setProrateRegistrationFee}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
                <Switch.Content>
                  <span className="text-sm">
                    Prorratear matrícula en función del avance de temporada
                  </span>
                </Switch.Content>
              </Switch>
            </>
          )}

          {(billingType === "SINGLE_ONLY" || billingType === "BOTH") && (
            <Switch
              isSelected={prorateSeasonFee}
              onChange={setProrateSeasonFee}
            >
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <span className="text-sm">
                  Prorratear tarifa de temporada (Pago único) en función del
                  avance
                </span>
              </Switch.Content>
            </Switch>
          )}
        </div>
      </div>
    </Card>
  );
};
