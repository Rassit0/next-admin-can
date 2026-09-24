import {
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  ClockIcon,
  CancelCircleIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";

export const PAYMENT_STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    icon: ClockIcon,
    color: "warning",
    bgColor: "bg-warning/10",
    textColor: "text-warning",
  },
  processing: {
    label: "Procesando",
    icon: AlertCircleIcon,
    color: "accent",
    bgColor: "bg-accent/10",
    textColor: "text-accent",
  },
  completed: {
    label: "Completado",
    icon: CheckmarkCircle01Icon,
    color: "success",
    bgColor: "bg-success/10",
    textColor: "text-success",
  },
  failed: {
    label: "Fallido",
    icon: CancelCircleIcon,
    color: "danger",
    bgColor: "bg-danger/10",
    textColor: "text-danger",
  },
  cancelled: {
    label: "Cancelado",
    icon: Cancel01Icon,
    color: "default",
    bgColor: "bg-default/10",
    textColor: "text-default-foreground",
  },
} as const;

export const PAYMENT_METHOD_CONFIG = {
  "credit-card": {
    label: "Tarjeta de CriÂ©dito",
    icon: "Ã°ÂÂÂ³",
  },
  "debit-card": {
    label: "Tarjeta de DiÂ©bito",
    icon: "Ã°ÂÂÂ³",
  },
  "bank-transfer": {
    label: "Transferencia Bancaria",
    icon: "Ã°ÂÂÂ¦",
  },
  cash: {
    label: "Efectivo",
    icon: "Ã°ÂÂÂµ",
  },
} as const;
