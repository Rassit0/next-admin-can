"use client";
import { Button, Input, TextField } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useCallback, useState } from "react";
import { PaginationSection } from "@/ui";
import { ITransactionsResponse } from "../interfaces/transaction.interface";
import { CashFlowTable } from "./table/CashFlowTable";
import { DirectTransactionDrawer } from "./drawers/DirectTransactionDrawer";

import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";

interface Props {
  response: ITransactionsResponse;
  categories: Array<{ id: string; name: string; type: string }>;
  financialAccounts: FinancialAccount[];
}

export const CashFlowClient = ({ response, categories, financialAccounts }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

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

  const handleSearch = useDebouncedCallback((term) => {
    router.push(pathname + "?" + createQueryString("search", term));
  }, 300);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TextField className="relative max-w-xs">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-default-400"
              size={18}
            />
          </div>
          <Input
            placeholder="Buscar movimientos..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            className="pl-9"
          />
        </TextField>

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
        categories={categories.filter(c => c.type === (transactionType === "INCOME" ? "RECEIVABLE" : "PAYABLE"))}
        financialAccounts={financialAccounts}
      />
    </div>
  );
};
