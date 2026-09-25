"use client";

import {
  Button,
  Input,
  Select,
  Tab,
  Tabs,
  Card,
  Spinner,
  toast,
  TextField,
  Label,
  FieldError,
  ListBox,
} from "@heroui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Shield01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { IMemberTeamSeasonAssignment } from "@/modules/membresias/types";
import { processPayment } from "@/modules/pagos/actions";

interface PaymentFormProps {
  assignment: IMemberTeamSeasonAssignment;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Luhn algorithm for card validation
const validateCardNumber = (num: string): boolean => {
  const digits = num.replace(/\D/g, "");
  if (digits.length < 13) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

export const PaymentForm = ({
  assignment,
  onSuccess,
  onError,
}: PaymentFormProps) => {
  const [selectedTab, setSelectedTab] = useState<"card" | "transfer">("card");
  const [isLoading, setIsLoading] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [transferData, setTransferData] = useState({
    bankName: "",
    accountNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const formatted = digits.replace(/(\d{4})/g, "$1 ").trim();
    return formatted;
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
    }
    return digits;
  };

  const validateCardForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardData.cardNumber || !validateCardNumber(cardData.cardNumber)) {
      newErrors.cardNumber = "Número de tarjeta inválido";
    }
    if (!cardData.cardHolder) {
      newErrors.cardHolder = "Nombre del titular requerido";
    }
    if (!cardData.expiryDate || !/^\d{2}\/\d{2}$/.test(cardData.expiryDate)) {
      newErrors.expiryDate = "Fecha de vencimiento inválida (MM/YY)";
    }
    if (!cardData.cvv || !/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = "CVV inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateTransferForm = () => {
    const newErrors: Record<string, string> = {};

    if (!transferData.bankName) {
      newErrors.bankName = "Banco requerido";
    }
    if (!transferData.accountNumber) {
      newErrors.accountNumber = "Número de cuenta requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      let isValid = false;
      let payload: any = {
        assignmentId: assignment.id,
        amount: assignment.totalInitialCharges,
        method: selectedTab === "card" ? "credit-card" : "bank-transfer",
      };

      if (selectedTab === "card") {
        isValid = validateCardForm();
        if (!isValid) {
          toast.danger("Validación fallida");
          return;
        }
        payload = { ...payload, ...cardData };
      } else {
        isValid = validateTransferForm();
        if (!isValid) {
          toast.danger("Validación fallida");
          return;
        }
        payload = { ...payload, ...transferData };
      }

      const result = await processPayment(payload);

      if (result.error) {
        toast.danger(result.message || "Error al procesar pago");
        onError?.(result.message);
      } else {
        toast.success(result.message);
        onSuccess?.();
      }
    } catch (error) {
      toast.danger("Error al procesar pago");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="rounded-lg bg-accent/10 p-4 flex items-start gap-3"
      >
        <HugeiconsIcon
          icon={Shield01Icon}
          size={18}
          className="text-accent shrink-0 mt-0.5"
        />
        <div className="text-sm text-accent">
          <p className="font-semibold">Pago Seguro</p>
          <p className="text-xs opacity-80">
            Tu información está encriptada y protegida
          </p>
        </div>
      </motion.div>

      <Card className="p-6 border border-border">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => {
            setSelectedTab(key as "card" | "transfer");
            setErrors({});
          }}
          aria-label="Métodos de pago"
        >
          <Tabs.ListContainer>
            <Tabs.List aria-label="Options">
              <Tabs.Tab id="card">
                Tarjeta de Crédito
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="transfer">
                Transferencia Bancaria
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
          <Tabs.Panel key="card">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="space-y-4 pt-4"
            >
              <TextField
                name="cardNumber"
                value={formatCardNumber(cardData.cardNumber)}
                isInvalid={!!errors.cardNumber}
                isDisabled={isLoading}
                onChange={(value) =>
                  setCardData({
                    ...cardData,
                    cardNumber: value.replace(/\s/g, ""),
                  })
                }
              >
                <Label>Número de Tarjeta</Label>
                <Input placeholder="4532 1234 5678 9010" />
                <FieldError>{errors.cardNumber}</FieldError>
              </TextField>

              <TextField
                name="cardHolder"
                value={cardData.cardHolder}
                onChange={(value) =>
                  setCardData({ ...cardData, cardHolder: value })
                }
                isInvalid={!!errors.cardHolder}
                isDisabled={isLoading}
              >
                <Label>Nombre del Titular</Label>
                <Input placeholder="Juan Pérez" />
                <FieldError>{errors.cardHolder}</FieldError>
              </TextField>

              <div className="grid grid-cols-2 gap-4">
                <TextField
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={(value) =>
                    setCardData({
                      ...cardData,
                      expiryDate: formatExpiryDate(value),
                    })
                  }
                  isInvalid={!!errors.expiryDate}
                  isDisabled={isLoading}
                >
                  <Label>Vencimiento</Label>
                  <Input placeholder="MM/YY" />
                  <FieldError>{errors.expiryDate}</FieldError>
                </TextField>

                <TextField
                  name="cvv"
                  value={cardData.cvv}
                  onChange={(value) =>
                    setCardData({
                      ...cardData,
                      cvv: value.replace(/\D/g, "").slice(0, 4),
                    })
                  }
                  isInvalid={!!errors.cvv}
                  isDisabled={isLoading}
                >
                  <Label>CVV</Label>
                  <Input type="password" placeholder="123" />
                  <FieldError>{errors.cvv}</FieldError>
                </TextField>
              </div>
            </motion.div>
          </Tabs.Panel>

          <Tabs.Panel key="transfer">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="space-y-4 pt-4"
            >
              <Select
                value={transferData.bankName}
                onChange={(value) => {
                  if (!value) return;
                  setTransferData({
                    ...transferData,
                    bankName: value as string,
                  });
                }}
                isInvalid={!!errors.bankName}
                isDisabled={isLoading}
                placeholder="Selecciona tu banco"
              >
                <Label>Banco</Label>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <FieldError>{errors.bankName}</FieldError>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="banco-mercantil">
                      <Label>Banco Mercantil</Label>
                    </ListBox.Item>
                    <ListBox.Item id="banco-bisa">
                      <Label>Banco Bisa</Label>
                    </ListBox.Item>
                    <ListBox.Item id="banco-fassil">
                      <Label>Banco Fassil</Label>
                    </ListBox.Item>
                    <ListBox.Item id="banco-ecb">
                      <Label>Banco de Crédito Boliviano</Label>
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <TextField
                name="accountNumber"
                value={transferData.accountNumber}
                onChange={(value) =>
                  setTransferData({ ...transferData, accountNumber: value })
                }
                isInvalid={!!errors.accountNumber}
                isDisabled={isLoading}
              >
                <Label>Número de Cuenta</Label>
                <Input placeholder="Ingresa tu número de cuenta" />
                <FieldError>{errors.accountNumber}</FieldError>
              </TextField>

              <div className="rounded-lg bg-warning/10 p-3 flex items-start gap-2">
                <HugeiconsIcon
                  icon={AlertCircleIcon}
                  size={16}
                  className="text-warning shrink-0 mt-0.5"
                />
                <p className="text-xs text-warning">
                  Recibirás instrucciones de transferencia bancaria por correo
                </p>
              </div>
            </motion.div>
          </Tabs.Panel>
        </Tabs>
      </Card>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="flex gap-3"
      >
        <Button
          fullWidth
          variant="primary"
          size="lg"
          onPress={handlePayment}
          isDisabled={isLoading}
          isPending={isLoading}
        >
          {!isLoading && <HugeiconsIcon icon={ArrowRight01Icon} size={18} />}
          {isLoading
            ? "Procesando..."
            : `Pagar ${new Intl.NumberFormat("es-BO", {
                style: "currency",
                currency: "BOB",
              }).format(assignment.totalInitialCharges)}`}
        </Button>
      </motion.div>
    </div>
  );
};
