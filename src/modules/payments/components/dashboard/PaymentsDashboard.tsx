"use client";
import { Card, Tabs, toast } from "@heroui/react";
import {
  Wallet01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPlayerMembership } from "@/modules/player-memberships";
import { formatCurrency } from "@/modules/player-memberships";
import {
  IPayment,
  PaymentMethod,
} from "@/modules/payments/interfaces/payment.interface";
import { buildPaymentLedger } from "@/modules/payments/helpers/gateway";
import { PaymentsHistoryTable } from "@/modules/payments/components/table/PaymentsHistoryTable";
import { PaymentGatewayModal } from "@/modules/payments/components/gateway/PaymentGatewayModal";

interface Props {
  memberships: IPlayerMembership[];
  teamSeason: ITeamSeason;
}

export const PaymentsDashboard = ({ memberships, teamSeason }: Props) => {
  const [payments, setPayments] = useState<IPayment[]>(() =>
    buildPaymentLedger(memberships, teamSeason),
  );
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selected, setSelected] = useState<IPayment | null>(null);
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);

  const pending = payments.filter((p) => p.status === "PENDING");
  const paid = payments.filter((p) => p.status === "PAID");

  const totals = useMemo(() => {
    const currency = payments[0]?.currency ?? "Bs";
    const collected = paid.reduce((acc, p) => acc + p.amount, 0);
    const outstanding = pending.reduce((acc, p) => acc + p.amount, 0);
    return { currency, collected, outstanding };
  }, [payments, paid, pending]);

  const openGateway = (payment: IPayment) => {
    setSelected(payment);
    setIsGatewayOpen(true);
  };

  const handlePaid = (
    paymentId: string,
    reference: string,
    method: PaymentMethod,
  ) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "PAID",
              method,
              reference,
              paidAt: new Date(),
            }
          : p,
      ),
    );
    toast.success("Pago registrado", {
      description: `Ref. ${reference}`,
    });
  };

  const cards = [
    {
      label: "Total recaudado",
      value: formatCurrency(totals.collected, totals.currency),
      icon: CheckmarkCircle02Icon,
      tone: "text-success",
      bg: "bg-success/10",
    },
    {
      label: "Saldo pendiente",
      value: formatCurrency(totals.outstanding, totals.currency),
      icon: Clock01Icon,
      tone: "text-warning",
      bg: "bg-warning/10",
    },
    {
      label: "Pagos pendientes",
      value: String(pending.length),
      icon: Wallet01Icon,
      tone: "text-accent",
      bg: "bg-accent-soft",
    },
  ];

  const tableForTab = (key: string) => {
    if (key === "pending") return pending;
    if (key === "paid") return paid;
    return payments;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
            className="h-full"
          >
            <Card className="card-hover h-full p-5 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
                    {card.value}
                  </p>
                </div>
                <span
                  className={`flex-shrink-0 flex size-12 items-center justify-center rounded-lg ${card.bg} ${card.tone} shadow-sm`}
                >
                  <HugeiconsIcon icon={card.icon} size={22} />
                </span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="p-6 shadow-[0px_4px_12px_rgba(0,0,0,0.06)] border border-border">
        <Tabs
          selectedKey={activeTab}
          onSelectionChange={(key) => setActiveTab(String(key))}
          className="w-full"
        >
          <Tabs.List className="gap-1">
            <Tabs.Tab id="pending" className="text-xs font-semibold">
              Pendientes <span className="ml-1.5 px-2 py-0.5 rounded-full bg-warning/10 text-warning text-[10px] font-bold">{pending.length}</span>
            </Tabs.Tab>
            <Tabs.Tab id="paid" className="text-xs font-semibold">
              Realizados <span className="ml-1.5 px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold">{paid.length}</span>
            </Tabs.Tab>
            <Tabs.Tab id="all" className="text-xs font-semibold">
              Todos <span className="ml-1.5 px-2 py-0.5 rounded-full bg-default/20 text-muted text-[10px] font-bold">{payments.length}</span>
            </Tabs.Tab>
          </Tabs.List>

          {["pending", "paid", "all"].map((key) => (
            <Tabs.Panel key={key} id={key} className="pt-6">
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <PaymentsHistoryTable
                  payments={tableForTab(key)}
                  onPay={openGateway}
                  emptyLabel={
                    key === "pending"
                      ? "No hay pagos pendientes. Todo al día."
                      : key === "paid"
                        ? "Aún no se han registrado pagos."
                        : "No hay movimientos de pago."
                  }
                />
              </motion.div>
            </Tabs.Panel>
          ))}
        </Tabs>
      </Card>

      <PaymentGatewayModal
        payment={selected}
        isOpen={isGatewayOpen}
        onOpenChange={setIsGatewayOpen}
        onPaid={handlePaid}
      />
    </div>
  );
};
