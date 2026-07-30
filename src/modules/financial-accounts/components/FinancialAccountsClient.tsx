"use client";
import React, { useState } from "react";
import { FinancialAccount } from "../interfaces/financial-account.interface";
import { Button, Card, Chip } from "@heroui/react";
import { PlusSignIcon, BankIcon, Wallet01Icon, Money01Icon, Edit02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FinancialAccountDrawer } from "./FinancialAccountDrawer";
import { CashClosuresDrawer } from "@/modules/cash-closures/components/CashClosuresDrawer";

interface Props {
  accounts: FinancialAccount[];
}

export const FinancialAccountsClient = ({ accounts }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = (open: boolean) => setIsOpen(open);
  const onOpen = () => setIsOpen(true);
  const [accountToEdit, setAccountToEdit] = useState<FinancialAccount | null>(null);
  
  const [isClosuresOpen, setIsClosuresOpen] = useState(false);
  const [accountForClosures, setAccountForClosures] = useState<FinancialAccount | null>(null);

  const handleOpenCreate = () => {
    setAccountToEdit(null);
    onOpen();
  };

  const handleOpenEdit = (account: FinancialAccount) => {
    setAccountToEdit(account);
    onOpen();
  };

  const handleOpenClosures = (account: FinancialAccount) => {
    setAccountForClosures(account);
    setIsClosuresOpen(true);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BANK":
        return <HugeiconsIcon icon={BankIcon} size={24} className="text-primary" />;
      case "DIGITAL_WALLET":
        return <HugeiconsIcon icon={Wallet01Icon} size={24} className="text-secondary" />;
      case "CASH":
      default:
        return <HugeiconsIcon icon={Money01Icon} size={24} className="text-success" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cuentas Financieras</h2>
          <p className="text-default-500">
            Gestiona cajas físicas, cuentas bancarias y billeteras digitales.
          </p>
        </div>
        <Button variant="primary" onPress={handleOpenCreate}>
          <HugeiconsIcon icon={PlusSignIcon} />
          Nueva Cuenta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <Card key={acc.id} className="shadow-sm border border-default-200">
            <Card.Header className="flex gap-3 items-start justify-between">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-default-100 rounded-lg">
                  {getIcon(acc.type)}
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-bold">{acc.name}</p>
                  <p className="text-small text-default-500">
                    {acc.accountNumber || (acc.type === "CASH" ? "Efectivo" : "Sin número")}
                  </p>
                </div>
              </div>
              <Button isIconOnly variant="ghost" size="sm" onPress={() => handleOpenEdit(acc)}>
                <HugeiconsIcon icon={Edit02Icon} size={18} className="text-default-400" />
              </Button>
            </Card.Header>
            <Card.Content className="pt-0">
              <div className="flex flex-col gap-4">
                {acc.description && (
                  <p className="text-sm text-default-500">{acc.description}</p>
                )}
                <div className="flex flex-row justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-default-500 uppercase tracking-wider">Saldo Disponible</span>
                    <span className="text-xl font-bold">
                      {acc.currency} {Number(acc.cachedBalance).toLocaleString("es-BO", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {acc.isDefault && (
                    <Chip color="accent" variant="soft" size="sm">
                      Por defecto
                    </Chip>
                  )}
                </div>
              </div>
              {acc.type === "CASH" && (
                <div className="mt-4 pt-4 border-t border-default-100 flex justify-end">
                  <Button size="sm" variant="secondary" onPress={() => handleOpenClosures(acc)}>
                    Arqueos de Caja
                  </Button>
                </div>
              )}
            </Card.Content>
          </Card>
        ))}
        {accounts.length === 0 && (
          <div className="col-span-full p-12 text-center text-default-500 bg-default-50 rounded-xl border border-dashed border-default-300">
            No hay cuentas financieras registradas.
          </div>
        )}
      </div>

      <FinancialAccountDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        accountToEdit={accountToEdit}
      />
      
      <CashClosuresDrawer
        isOpen={isClosuresOpen}
        onOpenChange={setIsClosuresOpen}
        account={accountForClosures}
      />
    </div>
  );
};
