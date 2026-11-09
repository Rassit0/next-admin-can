"use client";
import React, { useState } from "react";
import { FinancialAccount } from "../interfaces/financial-account.interface";
import { Button, Card, Chip, AlertDialog } from "@heroui/react";
import {
  PlusSignIcon,
  BankIcon,
  Wallet01Icon,
  Money01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { FinancialAccountDrawer } from "./FinancialAccountDrawer";
import { CashClosuresDrawer } from "@/modules/cash-closures/components/CashClosuresDrawer";
import { usePermissions } from "@/shared/providers/PermissionsProvider";
import { updateFinancialAccount } from "../actions/update";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  accounts: FinancialAccount[];
}

export const FinancialAccountsClient = ({ accounts }: Props) => {
  const permissions = usePermissions();
  const canUpdate =
    permissions.includes("UPDATE_FINANCIAL_ACCOUNTS") ||
    permissions.includes("MANAGE_ALL");
  const canCreate =
    permissions.includes("CREATE_FINANCIAL_ACCOUNTS") ||
    permissions.includes("MANAGE_ALL");

  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = (open: boolean) => setIsOpen(open);
  const onOpen = () => setIsOpen(true);
  const [accountToEdit, setAccountToEdit] = useState<FinancialAccount | null>(
    null,
  );

  const [isClosuresOpen, setIsClosuresOpen] = useState(false);
  const [accountForClosures, setAccountForClosures] =
    useState<FinancialAccount | null>(null);

  // Modal de confirmación para inactivar / reactivar
  const [accountToToggle, setAccountToToggle] =
    useState<FinancialAccount | null>(null);
  const [isToggling, setIsToggling] = useState(false);

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

  const handleOpenToggleStatus = (account: FinancialAccount) => {
    setAccountToToggle(account);
  };

  const handleConfirmToggleStatus = async () => {
    if (!accountToToggle || isToggling) return;
    setIsToggling(true);

    try {
      const newStatus = !accountToToggle.isActive;
      const res = await updateFinancialAccount(accountToToggle.id, {
        isActive: newStatus,
      });

      if (res.error) {
        toast.error(res.message || "Error al actualizar el estado de la cuenta");
      } else {
        toast.success(
          newStatus
            ? `La cuenta "${accountToToggle.name}" fue reactivada exitosamente`
            : `La cuenta "${accountToToggle.name}" fue inactivada exitosamente`,
        );
        setAccountToToggle(null);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar la cuenta");
    } finally {
      setIsToggling(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "BANK":
        return (
          <HugeiconsIcon icon={BankIcon} size={24} className="text-primary" />
        );
      case "DIGITAL_WALLET":
        return (
          <HugeiconsIcon
            icon={Wallet01Icon}
            size={24}
            className="text-secondary"
          />
        );
      case "CASH":
      default:
        return (
          <HugeiconsIcon
            icon={Money01Icon}
            size={24}
            className="text-success"
          />
        );
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
        {canCreate && (
          <Button variant="primary" onPress={handleOpenCreate}>
            <HugeiconsIcon icon={PlusSignIcon} />
            Nueva Cuenta
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => (
          <Card
            key={acc.id}
            className={`shadow-sm border transition-all ${
              acc.isActive
                ? "border-default-200"
                : "border-default-200/60 bg-default-50/50 opacity-90"
            }`}
          >
            <Card.Header className="flex gap-3 items-start justify-between">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-default-100 rounded-lg">
                  {getIcon(acc.type)}
                </div>
                <div className="flex flex-col">
                  <p className="text-md font-bold">{acc.name}</p>
                  <p className="text-small text-default-500">
                    {acc.accountNumber ||
                      (acc.type === "CASH" ? "Efectivo" : "Sin número")}
                  </p>
                </div>
              </div>
              {canUpdate && (
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  onPress={() => handleOpenEdit(acc)}
                  aria-label={`Editar cuenta ${acc.name}`}
                >
                  <HugeiconsIcon
                    icon={Edit02Icon}
                    size={18}
                    className="text-default-400"
                  />
                </Button>
              )}
            </Card.Header>
            <Card.Content className="pt-0">
              <div className="flex flex-col gap-4">
                {acc.description && (
                  <p className="text-sm text-default-500">{acc.description}</p>
                )}
                <div className="flex flex-row justify-between items-center mt-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-default-500 uppercase tracking-wider">
                      Saldo Disponible
                    </span>
                    <span className="text-xl font-bold">
                      {acc.currency}{" "}
                      {Number(acc.cachedBalance).toLocaleString("es-BO", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    <Chip
                      color={acc.isActive ? "success" : "default"}
                      variant="soft"
                      size="sm"
                    >
                      {acc.isActive ? "Activa" : "Inactiva"}
                    </Chip>
                    {acc.isDefault && (
                      <Chip color="accent" variant="soft" size="sm">
                        Por defecto
                      </Chip>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-default-100 flex items-center justify-between gap-2">
                <div>
                  {acc.type === "CASH" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => handleOpenClosures(acc)}
                    >
                      Arqueos de Caja
                    </Button>
                  )}
                </div>
                {canUpdate && (
                  <div>
                    {acc.isActive ? (
                      <Button
                        size="sm"
                        variant="danger-soft"
                        onPress={() => handleOpenToggleStatus(acc)}
                      >
                        Inactivar cuenta
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onPress={() => handleOpenToggleStatus(acc)}
                      >
                        Reactivar cuenta
                      </Button>
                    )}
                  </div>
                )}
              </div>
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

      {/* Modal de confirmación contextual para inactivar o reactivar */}
      <AlertDialog
        isOpen={!!accountToToggle}
        onOpenChange={(open) => {
          if (!open) setAccountToToggle(null);
        }}
      >
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-md">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon
                  status={accountToToggle?.isActive ? "warning" : "accent"}
                />
                <AlertDialog.Heading>
                  {accountToToggle?.isActive
                    ? "Inactivar cuenta contable"
                    : "Reactivar cuenta contable"}
                </AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                {accountToToggle?.isActive ? (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-default-600">
                      Esta cuenta dejará de estar disponible para registrar
                      nuevas operaciones. Sus transacciones, saldos e historial
                      contable se conservarán.
                    </p>
                    <div className="p-3 bg-default-100 rounded-lg flex flex-col gap-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-default-500 font-medium">
                          Cuenta:
                        </span>
                        <span className="font-semibold text-foreground">
                          {accountToToggle.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-default-500 font-medium">
                          Código / Número:
                        </span>
                        <span className="font-mono text-foreground">
                          {accountToToggle.accountNumber ||
                            (accountToToggle.type === "CASH"
                              ? "Efectivo"
                              : "Sin número")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-default-500 font-medium">
                          Saldo Actual:
                        </span>
                        <span className="font-semibold text-foreground">
                          {accountToToggle.currency}{" "}
                          {Number(accountToToggle.cachedBalance).toLocaleString(
                            "es-BO",
                            { minimumFractionDigits: 2 },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-default-600">
                      La cuenta volverá a estar disponible para registrar nuevas
                      operaciones financieras ordinarias. Sus registros
                      históricos y saldo se mantendrán intactos.
                    </p>
                    <div className="p-3 bg-default-100 rounded-lg flex flex-col gap-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-default-500 font-medium">
                          Cuenta:
                        </span>
                        <span className="font-semibold text-foreground">
                          {accountToToggle?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-default-500 font-medium">
                          Código / Número:
                        </span>
                        <span className="font-mono text-foreground">
                          {accountToToggle?.accountNumber ||
                            (accountToToggle?.type === "CASH"
                              ? "Efectivo"
                              : "Sin número")}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  variant="tertiary"
                  onPress={() => setAccountToToggle(null)}
                  isDisabled={isToggling}
                >
                  Cancelar
                </Button>
                <Button
                  variant={accountToToggle?.isActive ? "danger" : "primary"}
                  onPress={handleConfirmToggleStatus}
                  isPending={isToggling}
                >
                  {accountToToggle?.isActive
                    ? "Inactivar cuenta"
                    : "Reactivar cuenta"}
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
};
