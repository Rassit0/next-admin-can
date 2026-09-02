"use client";
import { Button, Select, ListBox, Label } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { PaginationSection, Filters, DateRangeFilter } from "@/ui";
import { ITransactionsResponse } from "../interfaces/transaction.interface";
import { CashFlowTable } from "./table/CashFlowTable";
import { DirectTransactionDrawer } from "./drawers/DirectTransactionDrawer";

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
  response: ITransactionsResponse;
  categories: Array<{ id: string; name: string; type: string }>;
  financialAccounts: FinancialAccount[];
  allPaymentMethods: string[];
}

export const CashFlowClient = ({
  response,
  categories,
  financialAccounts,
  allPaymentMethods,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">(
    "EXPENSE",
  );

  const currentAccountId = searchParams.get("financialAccountIds") || "all";
  const currentMethod = searchParams.get("paymentMethods") || "all";

  const selectedAcc = financialAccounts.find((a) => a.id === currentAccountId);
  const availableMethods =
    selectedAcc?.allowedPaymentMethods &&
    selectedAcc.allowedPaymentMethods.length > 0
      ? selectedAcc.allowedPaymentMethods
      : allPaymentMethods;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Filters>
          <DateRangeFilter />
          <Select
            className="w-full max-w-50"
            placeholder="Cuentas contables"
            selectedKey={currentAccountId}
            onSelectionChange={(key) =>
              handleAccountChange(key?.toString() || "all")
            }
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
            selectedKey={currentMethod}
            onSelectionChange={(key) => handleMethodChange(key?.toString() || "all")}
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
        </Filters>

        <div className="flex gap-2">
          <Button
            variant="danger-soft"
            onPress={() => {
              setTransactionType("EXPENSE");
              setIsDrawerOpen(true);
            }}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Registrar Egreso
          </Button>
          <Button
            variant="primary"
            onPress={() => {
              setTransactionType("INCOME");
              setIsDrawerOpen(true);
            }}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={18} />
            Registrar Ingreso
          </Button>
        </div>
      </div>

      <CashFlowTable transactions={response.data} />
      {response.meta.totalPages > 1 && (
        <PaginationSection
          totalPages={response.meta.totalPages}
          itemsPerPage={response.meta.itemsPerPage}
          totalItems={response.meta.totalItems}
        />
      )}

      <DirectTransactionDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        type={transactionType}
        categories={categories.filter(
          (c) =>
            c.type ===
            (transactionType === "INCOME" ? "RECEIVABLE" : "PAYABLE"),
        )}
        financialAccounts={financialAccounts}
      />
    </div>
  );
};
