"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet02Icon, Building04Icon, SafeIcon, Activity01Icon } from "@hugeicons/core-free-icons";
import { InfoTooltip } from "@/ui";
import clsx from "clsx";

interface AccountDetail {
  id: string;
  name: string;
  type: string;
  currency: string;
  isActive: boolean;
  balance: number;
}

interface Props {
  accounts: AccountDetail[];
}

export const AccountingBalancesCard = ({ accounts }: Props) => {
  const formatCurrency = (amount: number, currency: string = "BOB") => {
    return new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "CASH":
        return <HugeiconsIcon icon={SafeIcon} size={20} />;
      case "BANK":
        return <HugeiconsIcon icon={Building04Icon} size={20} />;
      case "DIGITAL_WALLET":
        return <HugeiconsIcon icon={Wallet02Icon} size={20} />;
      default:
        return <HugeiconsIcon icon={Activity01Icon} size={20} />;
    }
  };

  const activeAccounts = accounts?.filter(acc => acc.isActive) || [];

  // Agrupamos por tipo (Cajas vs Bancos/Billeteras) para mejor visualización
  const cashAccounts = activeAccounts.filter(acc => acc.type === "CASH");
  const bankAccounts = activeAccounts.filter(acc => acc.type === "BANK" || acc.type === "DIGITAL_WALLET");

  const renderAccountGroup = (title: string, groupAccounts: AccountDetail[]) => {
    if (groupAccounts.length === 0) return null;
    
    return (
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-semibold text-default-500 uppercase tracking-wider">{title}</h4>
        <div className="flex flex-col gap-2">
          {groupAccounts.map(acc => (
            <div key={acc.id} className="flex justify-between items-center p-3 rounded-lg bg-default-100/50 hover:bg-default-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "p-2 rounded-md",
                  acc.type === "CASH" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                )}>
                  {getAccountIcon(acc.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{acc.name}</p>
                  <p className="text-[10px] text-default-400">
                    {acc.type === "CASH" ? "Caja" : acc.type === "BANK" ? "Banco" : "Billetera Digital"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={clsx(
                  "text-sm font-bold",
                  acc.balance === 0 ? "text-default-400" : acc.balance < 0 ? "text-danger" : "text-foreground"
                )}>
                  {formatCurrency(acc.balance, acc.currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="border-none bg-default-50 rounded-large shadow-sm flex flex-col h-full">
      <div className="p-4 sm:p-5 border-b border-border/50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">Saldos por Cuenta</h3>
          <InfoTooltip text="Desglose del saldo actual (liquidez) en las distintas cajas y cuentas bancarias." />
        </div>
      </div>
      <div className="p-4 sm:p-5 flex flex-col gap-6 overflow-y-auto">
        {activeAccounts.length === 0 ? (
          <p className="text-sm text-default-500 text-center py-4">No hay cuentas activas registradas.</p>
        ) : (
          <>
            {renderAccountGroup("Cajas", cashAccounts)}
            {renderAccountGroup("Bancos y Billeteras", bankAccounts)}
          </>
        )}
      </div>
    </div>
  );
};
