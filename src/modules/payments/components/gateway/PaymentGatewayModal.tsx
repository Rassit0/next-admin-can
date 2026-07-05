"use client";
import {
  Button,
  ComboBox,
  Input,
  Label,
  ListBox,
  Modal,
  Tabs,
  TextField,
} from "@heroui/react";
import {
  CreditCardIcon,
  BankIcon,
  SecurityCheckIcon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { IPayment, PaymentMethod } from "@/modules/payments/interfaces/payment.interface";
import { processPayment } from "@/modules/payments/helpers/gateway";
import { formatCurrency } from "@/modules/player-memberships";

interface Props {
  payment: IPayment | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: (paymentId: string, reference: string, method: PaymentMethod) => void;
}

type Phase = "form" | "processing" | "success" | "error";

const BANKS = [
  { id: "bnb", name: "Banco Nacional de Bolivia" },
  { id: "bmsc", name: "Banco Mercantil Santa Cruz" },
  { id: "bcp", name: "Banco de Crédito BCP" },
  { id: "bu", name: "Banco Unión" },
];

const formatCardNumber = (value: string): string =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ")
    .trim();

const formatExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export const PaymentGatewayModal = ({
  payment,
  isOpen,
  onOpenChange,
  onPaid,
}: Props) => {
  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [phase, setPhase] = useState<Phase>("form");
  const [feedback, setFeedback] = useState<string>("");
  const [lastReference, setLastReference] = useState<string>("");

  // Card fields
  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  // Transfer fields
  const [bank, setBank] = useState<string>("");
  const [reference, setReference] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPhase("form");
      setMethod("CARD");
      setFeedback("");
      setCardholder("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      setBank("");
      setReference("");
    }
  }, [isOpen]);

  const amountLabel = useMemo(
    () =>
      payment ? formatCurrency(payment.amount, payment.currency) : "",
    [payment],
  );

  const handlePay = async () => {
    if (!payment) return;
    setPhase("processing");
    const result = await processPayment(
      method === "CARD"
        ? { method: "CARD", cardholder, cardNumber, expiry, cvc }
        : { method: "TRANSFER", bank, reference },
    );
    if (result.success) {
      setLastReference(result.reference);
      setFeedback(result.message);
      setPhase("success");
      setTimeout(() => {
        onPaid(payment.id, result.reference, method);
        onOpenChange(false);
      }, 1500);
    } else {
      setFeedback(result.message);
      setPhase("error");
    }
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container placement="auto" scroll="outside">
        <Modal.Dialog className="sm:max-w-md bg-background-tertiary">
          <Modal.CloseTrigger />
          <Modal.Header>
            <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
              <HugeiconsIcon icon={SecurityCheckIcon} />
            </Modal.Icon>
            <Modal.Heading>Procesar pago</Modal.Heading>
            <p className="mt-1.5 text-sm leading-5 text-muted">
              {payment
                ? `${payment.concept} · ${payment.athleteName}`
                : "Selecciona un cargo pendiente"}
            </p>
          </Modal.Header>

          <Modal.Body className="p-6">
            {/* Amount summary */}
            <div className="mb-5 flex items-center justify-between rounded-2xl bg-accent px-4 py-3 text-accent-foreground">
              <span className="text-sm font-semibold">Total a pagar</span>
              <span className="text-2xl font-extrabold tabular-nums">
                {amountLabel}
              </span>
            </div>

            <AnimatePresence mode="wait">
              {phase === "form" && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <Tabs
                    selectedKey={method}
                    onSelectionChange={(key) =>
                      setMethod(key as PaymentMethod)
                    }
                  >
                    <Tabs.List className="w-full">
                      <Tabs.Tab id="CARD">
                        <HugeiconsIcon icon={CreditCardIcon} size={16} />
                        Tarjeta
                      </Tabs.Tab>
                      <Tabs.Tab id="TRANSFER">
                        <HugeiconsIcon icon={BankIcon} size={16} />
                        Transferencia
                      </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel id="CARD" className="pt-4">
                      <div className="flex flex-col gap-4">
                        <TextField className="w-full" name="cardholder">
                          <Label>Titular de la tarjeta</Label>
                          <Input
                            variant="secondary"
                            placeholder="Nombre como aparece en la tarjeta"
                            value={cardholder}
                            onChange={(e) => setCardholder(e.target.value)}
                          />
                        </TextField>
                        <TextField className="w-full" name="cardNumber">
                          <Label>Número de tarjeta</Label>
                          <Input
                            variant="secondary"
                            inputMode="numeric"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={(e) =>
                              setCardNumber(formatCardNumber(e.target.value))
                            }
                          />
                        </TextField>
                        <div className="flex gap-3">
                          <TextField className="w-full" name="expiry">
                            <Label>Vencimiento</Label>
                            <Input
                              variant="secondary"
                              inputMode="numeric"
                              placeholder="MM/AA"
                              value={expiry}
                              onChange={(e) =>
                                setExpiry(formatExpiry(e.target.value))
                              }
                            />
                          </TextField>
                          <TextField className="w-full" name="cvc">
                            <Label>CVC</Label>
                            <Input
                              variant="secondary"
                              inputMode="numeric"
                              placeholder="123"
                              value={cvc}
                              onChange={(e) =>
                                setCvc(
                                  e.target.value.replace(/\D/g, "").slice(0, 4),
                                )
                              }
                            />
                          </TextField>
                        </div>
                        <p className="text-[11px] leading-relaxed text-muted">
                          Entorno de simulación seguro. No ingreses datos reales
                          de tarjetas.
                        </p>
                      </div>
                    </Tabs.Panel>

                    <Tabs.Panel id="TRANSFER" className="pt-4">
                      <div className="flex flex-col gap-4">
                        <ComboBox
                          className="w-full"
                          variant="secondary"
                          menuTrigger="focus"
                          selectedKey={bank || null}
                          onSelectionChange={(key) =>
                            setBank(key ? String(key) : "")
                          }
                        >
                          <Label>Banco emisor</Label>
                          <ComboBox.InputGroup>
                            <Input
                              variant="secondary"
                              placeholder="Selecciona un banco"
                            />
                            <ComboBox.Trigger />
                          </ComboBox.InputGroup>
                          <ComboBox.Popover>
                            <ListBox>
                              {BANKS.map((b) => (
                                <ListBox.Item
                                  key={b.id}
                                  id={b.id}
                                  textValue={b.name}
                                >
                                  {b.name}
                                  <ListBox.ItemIndicator />
                                </ListBox.Item>
                              ))}
                            </ListBox>
                          </ComboBox.Popover>
                        </ComboBox>
                        <TextField className="w-full" name="reference">
                          <Label>Número de comprobante</Label>
                          <Input
                            variant="secondary"
                            placeholder="Ej. 0098123455"
                            value={reference}
                            onChange={(e) => setReference(e.target.value)}
                          />
                        </TextField>
                        <p className="text-[11px] leading-relaxed text-muted">
                          Registra el comprobante de la transferencia bancaria
                          para conciliar el pago.
                        </p>
                      </div>
                    </Tabs.Panel>
                  </Tabs>
                </motion.div>
              )}

              {phase === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 py-10"
                >
                  <motion.span
                    className="size-12 rounded-full border-4 border-accent-soft border-t-accent"
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.8,
                      ease: "linear",
                    }}
                  />
                  <p className="text-sm font-medium text-muted">
                    Contactando a la pasarela de pago...
                  </p>
                </motion.div>
              )}

              {phase === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3 py-8 text-center"
                >
                  <motion.span
                    className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 16 }}
                  >
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={36} />
                  </motion.span>
                  <p className="text-base font-bold text-foreground">
                    ¡Pago aprobado!
                  </p>
                  <p className="text-xs text-muted">{feedback}</p>
                  <p className="rounded-lg bg-surface px-3 py-1 text-[11px] font-medium text-muted">
                    Ref. {lastReference}
                  </p>
                </motion.div>
              )}

              {phase === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center gap-3 py-8 text-center"
                >
                  <span className="flex size-16 items-center justify-center rounded-full bg-danger/15 text-danger">
                    <HugeiconsIcon icon={Cancel01Icon} size={36} />
                  </span>
                  <p className="text-base font-bold text-foreground">
                    Pago rechazado
                  </p>
                  <p className="text-xs text-muted">{feedback}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Modal.Body>

          {(phase === "form" || phase === "error") && (
            <Modal.Footer>
              <Button
                variant="secondary"
                onPress={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              {phase === "error" ? (
                <Button onPress={() => setPhase("form")}>Reintentar</Button>
              ) : (
                <Button onPress={handlePay} isDisabled={!payment}>
                  <HugeiconsIcon icon={SecurityCheckIcon} size={18} />
                  Pagar {amountLabel}
                </Button>
              )}
            </Modal.Footer>
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
};
