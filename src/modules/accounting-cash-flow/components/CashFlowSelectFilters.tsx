"use client";
import { Select, ListBox, Label } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FinancialAccountOption } from "@/modules/financial-accounts/actions/get-options";

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Efectivo",
  CARD: "Tarjeta",
  TRANSFER: "Transferencia",
  QR: "QR",
  CHECK: "Cheque",
  DEPOSIT: "Depósito",
};

interface Props {
  financialAccounts: FinancialAccountOption[];
  allPaymentMethods: string[];
  categories: Array<{ id: string; name: string; type: string }>;
}

export const CashFlowSelectFilters = ({
  financialAccounts,
  allPaymentMethods,
  categories,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentAccountId = searchParams.get("financialAccountIds") || "all";
  const currentMethod = searchParams.get("paymentMethods") || "all";
  const currentCategory = searchParams.get("categoryId") || "all";
  const currentType = searchParams.get("type") || "all";

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

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value && value !== "all") {
      params.set("categoryId", value);
    } else {
      params.delete("categoryId");
    }
    router.push(pathname + "?" + params.toString());
  };

  const handleTypeChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    if (value && value !== "all") {
      params.set("type", value);
    } else {
      params.delete("type");
    }
    router.push(pathname + "?" + params.toString());
  };

  const accountOptions = [
    { id: "all", name: "Todas las cuentas" },
    ...financialAccounts.map((a) => ({ id: a.id, name: a.name })),
  ];

  const methodOptions = [
    { id: "all", name: "Todos los métodos" },
    ...availableMethods.map((m) => ({
      id: m,
      name: PAYMENT_METHOD_LABELS[m] || m,
    })),
  ];

  const categoryOptions = [
    { id: "all", name: "Todas las categorías" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  const typeOptions = [
    { id: "all", name: "Todos los tipos" },
    { id: "INCOME", name: "Ingreso" },
    { id: "EXPENSE", name: "Egreso" },
  ];

  return (
    <>
      <Select
        className="w-full max-w-40"
        placeholder="Tipo"
        value={currentType}
        onChange={(key) => handleTypeChange(key?.toString() || "all")}
        aria-label="Tipo"
        variant="secondary"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-default">
          <ListBox items={typeOptions}>
            {(item) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.name}
                className="hover:bg-accent-soft"
              >
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        className="w-full max-w-40"
        placeholder="Categoría"
        value={currentCategory}
        onChange={(key) => handleCategoryChange(key?.toString() || "all")}
        aria-label="Categoría"
        variant="secondary"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-default">
          <ListBox items={categoryOptions}>
            {(item) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.name}
                className="hover:bg-accent-soft"
              >
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        className="w-full max-w-50"
        placeholder="Cuentas contables"
        value={currentAccountId}
        onChange={(key) => handleAccountChange(key?.toString() || "all")}
        aria-label="Cuentas contables"
        variant="secondary"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-default">
          <ListBox items={accountOptions}>
            {(item) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.name}
                className="hover:bg-accent-soft"
              >
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Select.Popover>
      </Select>

      <Select
        className="w-full max-w-40"
        placeholder="Métodos de pago"
        value={currentMethod}
        onChange={(key) => handleMethodChange(key?.toString() || "all")}
        aria-label="Métodos de pago"
        variant="secondary"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-default">
          <ListBox items={methodOptions}>
            {(item) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.name}
                className="hover:bg-accent-soft"
              >
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Select.Popover>
      </Select>
    </>
  );
};
