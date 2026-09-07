"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { DirectTransactionDrawer } from "./drawers/DirectTransactionDrawer";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";

interface Props {
  categories: Array<{ id: string; name: string; type: string }>;
  financialAccounts: FinancialAccount[];
}

export const CashFlowActions = ({ categories, financialAccounts }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  return (
    <>
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
    </>
  );
};
