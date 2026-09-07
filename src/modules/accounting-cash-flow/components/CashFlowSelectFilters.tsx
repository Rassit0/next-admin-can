"use client";
import { Select, ListBox, Label } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  QR: "QR",
  CHECK: "Cheque",
  DEPOSIT: "Depósito",
};

interface Props {
  financialAccounts: FinancialAccount[];
  allPaymentMethods: string[];
}

export const CashFlowSelectFilters = ({
  financialAccounts,
  allPaymentMethods,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentAccountId = searchParams.get("financialAccountIds") || "all";
  const currentMethod = searchParams.get("paymentMethods") || "all";

  const selectedAcc = financialAccounts.find((a) => a.id === currentAccountId);
  const availableMethods =
    selectedAcc?.allowedPaymentMethods &&
    selectedAcc.allowedPaymentMethods.length > 0
      ? selectedAcc.allowedPaymentMethods
      : allPaymentMethods;

  const handleAccountChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value && value !== "all") {
      params.set("financialAccountIds", value);
      // Ensure current payment method is allowed in new account
      const acc = financialAccounts.find((a) => a.id === value);
      const accMethods =
        acc?.allowedPaymentMethods && acc.allowedPaymentMethods.length > 0
          ? acc.allowedPaymentMethods
          : allPaymentMethods;
      if (currentMethod !== "all" && !accMethods.includes(currentMethod)) {
        params.delete("paymentMethods");
      }
    } else {
      params.delete("financialAccountIds");
    }
    router.push(pathname + "?" + params.toString());
  };

  const handleMethodChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");

    if (value && value !== "all") {
      params.set("paymentMethods", value);
    } else {
      params.delete("paymentMethods");
    }
    router.push(pathname + "?" + params.toString());
  };

  return (
    <>
      <Select
        className="w-full max-w-50"
        placeholder="Cuentas contables"
        value={currentAccountId}
        onChange={(key) => handleAccountChange(key?.toString() || "all")}
      >
        <Label className="sr-only">Cuentas contables</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-default">
          <ListBox>
            <ListBox.Item
              id="all"
              textValue="Todas las cuentas"
              className="hover:bg-accent-soft"
            >
              Todas las cuentas
              <ListBox.ItemIndicator />
            </ListBox.Item>
            {financialAccounts.map((acc) => (
              <ListBox.Item
                key={acc.id}
                id={acc.id}
                textValue={acc.name}
                className="hover:bg-accent-soft"
              >
                {acc.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        className="w-full max-w-50"
        placeholder="Métodos de pago"
        value={currentMethod}
        onChange={(key) => handleMethodChange(key?.toString() || "all")}
      >
        <Label className="sr-only">Métodos de pago</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-default">
          <ListBox>
            <ListBox.Item
              id="all"
              textValue="Todos los métodos"
              className="hover:bg-accent-soft"
            >
              Todos los métodos
              <ListBox.ItemIndicator />
            </ListBox.Item>
            {availableMethods.map((method) => (
              <ListBox.Item
                key={method}
                id={method}
                textValue={PAYMENT_METHOD_LABELS[method] || method}
                className="hover:bg-accent-soft"
              >
                {PAYMENT_METHOD_LABELS[method] || method}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </>
  );
};
