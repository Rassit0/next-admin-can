import { PaymentStatus } from "@/modules/payments/interfaces/payment.interface";

type ChipColor = "accent" | "danger" | "default" | "success" | "warning";

interface PaymentStatusConfig {
  label: string;
  color: ChipColor;
  dot: string;
}

export const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, PaymentStatusConfig> =
  {
    PAID: { label: "Pagado", color: "success", dot: "bg-success" },
    PENDING: { label: "Pendiente", color: "warning", dot: "bg-warning" },
    PROCESSING: { label: "Procesando", color: "accent", dot: "bg-accent" },
    FAILED: { label: "Rechazado", color: "danger", dot: "bg-danger" },
  };

export const getPaymentStatusConfig = (
  status: PaymentStatus,
): PaymentStatusConfig =>
  PAYMENT_STATUS_CONFIG[status] ?? PAYMENT_STATUS_CONFIG.PENDING;
