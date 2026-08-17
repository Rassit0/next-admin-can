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
import {
  Calendar03Icon,
  MoneyExchange01Icon,
  Money03Icon,
  UnavailableIcon,
} from "@hugeicons/core-free-icons";
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
  isFinancialDisabled?: boolean;
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
  isFinancialDisabled = false,
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
            <Alert.Title>Configuración de Cobros</Alert.Title>
            <Alert.Description>
              Configura cómo se estructurarán los cobros de los atletas
              de esta temporada. El modelo de facturación determina si se cobra
              cada ciclo temporal o si se hace un único pago por adelantado.
            </Alert.Description>
          </Alert.Content>
        </Alert>

        <Select
          isRequired
          isDisabled={isFinancialDisabled}
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
            <b>Recurrente:</b> el precio se aplica a cada ciclo temporal (semanal, quincenal, o
            mensual). <br />
            <b>Único:</b> cobra el valor de toda la temporada por adelantado.{" "}
            <br />
            <b>Ambos:</b> permite al cliente elegir su modalidad al inscribirse.
          </Description>
        </Select>

        {billingType !== "SINGLE_ONLY" && (
          <Select
            isRequired
            isDisabled={isFinancialDisabled}
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
            <Label>Duración del Ciclo</Label>
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
              Determina el período de tiempo que abarca cada ciclo. El atleta deberá
              adquirir los ciclos para estar al día.
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
            <Label>Costo de Inscripción / Matrícula</Label>
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
              {isFinancialDisabled && (
                <span className="block mt-1 text-warning-600 font-medium">
                  Nota: Modificar este valor solo afectará a las{" "}
                  <b>nuevas inscripciones</b>.
                </span>
              )}
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
              Precio del Ciclo (
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
              Precio a pagar por la adquisición de cada ciclo.
              {isFinancialDisabled && (
                <span className="block mt-1 text-warning-600 font-medium">
                  Nota: Modificar este valor aplicará para las{" "}
                  <b>nuevas suscripciones y los próximos ciclos adquiridos</b>.
                </span>
              )}
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
              {isFinancialDisabled && (
                <span className="block mt-1 text-warning-600 font-medium">
                  Nota: Modificar este valor solo afectará a las{" "}
                  <b>nuevas inscripciones</b> que elijan este método.
                </span>
              )}
            </Description>
          </TextField>
        )}

        <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-secondary">
          <h3 className="font-headline font-bold text-lg text-on-surface">
            Configuración del Ciclo
          </h3>
          <p className="text-xs text-on-surface-variant font-medium">
            Vencimiento y prorrateos de los ciclos comprados.
          </p>

          <Alert status="accent">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Cálculos Proporcionales (Prorrateos)</Alert.Title>
              <Alert.Description>
                Activa estas opciones para que el sistema sugiera montos
                justos en función del día exacto en que el atleta inicie o
                termine su membresía.
                <br />
                <strong>Ejemplo:</strong> Si la cuota de ciclo es de 100 Bs. y el
                atleta se inscribe a mitad del mes, el sistema le sugerirá
                un cargo de 50 Bs.
              </Alert.Description>
            </Alert.Content>
          </Alert>

          {billingType !== "SINGLE_ONLY" && (
            <>
              <Switch
                isDisabled={isFinancialDisabled}
                isSelected={prorateFirstRecurringFee}
                onChange={setProrateFirstRecurringFee}
              >
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <span className="text-sm">
                    Prorratear primera cuota recurrente (si no es ciclo
                    completo)
                  </span>
                </Switch.Content>
              </Switch>
              <Switch
                isDisabled={isFinancialDisabled}
                isSelected={prorateLastRecurringFee}
                onChange={setProrateLastRecurringFee}
              >
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <span className="text-sm">
                    Prorratear última cuota recurrente (al finalizar temporada)
                  </span>
                </Switch.Content>
              </Switch>
              <Switch
                isDisabled={isFinancialDisabled}
                isSelected={prorateRegistrationFee}
                onChange={setProrateRegistrationFee}
              >
                <Switch.Content>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <span className="text-sm">
                    Prorratear matrícula en función del avance de temporada
                  </span>
                </Switch.Content>
              </Switch>
            </>
          )}

          {(billingType === "SINGLE_ONLY" || billingType === "BOTH") && (
            <Switch
              isDisabled={isFinancialDisabled}
              isSelected={prorateSeasonFee}
              onChange={setProrateSeasonFee}
            >
              <Switch.Content>
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
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
