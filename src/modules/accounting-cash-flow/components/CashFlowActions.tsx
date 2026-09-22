"use client";
import { Button } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { usePermissions } from "@/shared/providers/PermissionsProvider";
import { DirectTransactionDrawer } from "./drawers/DirectTransactionDrawer";
import { FinancialAccountOption } from "@/modules/financial-accounts/actions/get-options";

interface Props {
  categories: Array<{ id: string; name: string; type: string }>;
  financialAccounts: FinancialAccountOption[];
}

export const CashFlowActions = ({ categories, financialAccounts }: Props) => {
  const permissions = usePermissions();
  const canCreateAccountCharges = permissions.includes("CREATE_ACCOUNT_CHARGES");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  return (
    <>
      {canCreateAccountCharges && (
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
        </>
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
    </>
  );
};
