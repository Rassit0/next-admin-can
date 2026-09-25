"use client";
import React, { useEffect, useState } from "react";
import { Drawer, Button, Spinner } from "@heroui/react";
import { FinancialAccount } from "@/modules/financial-accounts/interfaces/financial-account.interface";
import { CashClosure } from "../interfaces/cash-closure.interface";
import { getCashClosuresByAccount } from "../actions/list";
import { toast } from "sonner";
import { CashClosureFormModal } from "./CashClosureFormModal";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  account: FinancialAccount | null;
}

export const CashClosuresDrawer = ({
  isOpen,
  onOpenChange,
  account,
}: Props) => {
  const [closures, setClosures] = useState<CashClosure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (isOpen && account) {
      loadClosures();
    }
  }, [isOpen, account]);

  const loadClosures = async () => {
    if (!account) return;
    setIsLoading(true);
    const res = await getCashClosuresByAccount(account.id, 1, 50);
    if (res.error) {
      toast.error(res.message);
    } else {
      setClosures(res.data?.data || []);
    }
    setIsLoading(false);
  };

  const handleSuccess = () => {
    loadClosures();
  };

  return (
    <>
      <Drawer>
        <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
          <Drawer.Content placement="right">
            <Drawer.Dialog className="w-full sm:max-w-md bg-background-tertiary">
              <Drawer.CloseTrigger />
              <Drawer.Header className="border-b border-border flex flex-col gap-1">
                <Drawer.Heading className="text-lg font-bold">
                  Historial de Arqueos
                </Drawer.Heading>
                <span className="text-sm font-normal text-on-surface-variant">
                  {account?.name}
                </span>
              </Drawer.Header>
              <Drawer.Body className="flex flex-col gap-5 pt-6">
                <div className="flex justify-end mb-4">
                  <Button variant="primary" onPress={() => setIsFormOpen(true)}>
                    Realizar Arqueo
                  </Button>
                </div>

                {isLoading ? (
                  <div className="flex justify-center p-8">
                    <Spinner />
                  </div>
                ) : closures.length === 0 ? (
                  <div className="text-center p-8 text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant/30">
                    No hay arqueos registrados para esta caja.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pb-8">
                    {closures.map((closure) => (
                      <div
                        key={closure.id}
                        className="p-4 border border-outline-variant/30 rounded-xl shadow-sm flex flex-col gap-2 bg-surface-container-low"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-sm">
                            {new Date(closure.closedAt).toLocaleString(
                              "es-BO",
                              { dateStyle: "short", timeStyle: "short" },
                            )}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              Number(closure.difference) < 0
                                ? "text-danger"
                                : Number(closure.difference) > 0
                                  ? "text-warning"
                                  : "text-success"
                            }`}
                          >
                            Dif:{" "}
                            {Number(closure.difference).toLocaleString(
                              "es-BO",
                              { minimumFractionDigits: 2 },
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 text-sm gap-2">
                          <div className="flex flex-col">
                            <span className="text-on-surface-variant text-xs">
                              Esperado
                            </span>
                            <span>
                              {Number(closure.expectedBalance).toLocaleString(
                                "es-BO",
                                { minimumFractionDigits: 2 },
                              )}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-on-surface-variant text-xs">
                              Físico
                            </span>
                            <span>
                              {Number(closure.actualBalance).toLocaleString(
                                "es-BO",
                                { minimumFractionDigits: 2 },
                              )}
                            </span>
                          </div>
                        </div>
                        {closure.observations && (
                          <div className="mt-2 text-sm text-on-surface-variant bg-background p-2 rounded-lg">
                            <span className="font-semibold">Obs:</span>{" "}
                            {closure.observations}
                          </div>
                        )}
                        <div className="mt-1 text-xs text-on-surface-variant/70">
                          Por: {closure.createdBy?.person?.firstName}{" "}
                          {closure.createdBy?.person?.lastName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      <CashClosureFormModal
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        account={account}
        onSuccess={handleSuccess}
      />
    </>
  );
};
