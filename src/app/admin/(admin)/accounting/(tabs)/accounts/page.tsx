import { getFinancialAccounts } from "@/modules/financial-accounts/actions/get-all";
import { FinancialAccountsClient } from "@/modules/financial-accounts/components/FinancialAccountsClient";
import React from "react";
import { resolvePageData } from "@/utils/resolvePageData";

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const [accountsRes] = await resolvePageData([getFinancialAccounts()]);
  const accounts = accountsRes.data || [];

  return (
    <div className="w-full">
      <FinancialAccountsClient accounts={accounts} />
    </div>
  );
}
