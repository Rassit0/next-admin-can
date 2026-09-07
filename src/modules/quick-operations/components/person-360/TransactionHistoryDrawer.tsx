"use client";
import React, { useEffect, useState } from "react";
import { Drawer, Spinner, Pagination } from "@heroui/react";
import { TableTransactions } from "@/modules/charge-transactions/components/table/TableTransactions";
import { getPersonTransactions } from "../../actions/get-person-transactions";
import { IPersonOption } from "@/common/actions/get-persons-options";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  person: IPersonOption | null;
}

export const TransactionHistoryDrawer = ({
  isOpen,
  onOpenChange,
  person,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    if (isOpen && person?.id) {
      fetchTransactions();
    } else {
      setTransactions([]);
      setPage(1);
      setTotalPages(1);
    }
  }, [isOpen, person?.id, page]);

  const fetchTransactions = async () => {
    if (!person?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getPersonTransactions(person.id, page, limit);
      if (res.error) {
        setError(res.message);
      } else {
        setTransactions(res.data?.data || []);
        const meta = res.data?.meta;
        if (meta && meta.lastPage) {
          setTotalPages(meta.lastPage);
        }
      }
    } catch (err) {
      setError("Ocurrió un error al cargar el historial.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Drawer.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Drawer.Content placement="right">
        <Drawer.Dialog aria-label="Historial de Pagos" className="w-full sm:max-w-4xl overflow-y-hidden flex flex-col h-full">
          <Drawer.CloseTrigger />
          <Drawer.Header className="border-b border-border shrink-0">
            <Drawer.Heading className="text-xl font-bold flex items-center gap-2">
              <i className="ri-history-line text-default-500"></i> Historial de
              Pagos
            </Drawer.Heading>
            <p className="text-sm text-default-500">
              Mostrando recibos y transacciones de{" "}
              <span className="font-semibold text-foreground">
                {person?.fullName}
              </span>
            </p>
          </Drawer.Header>

          <Drawer.Body className="p-0 flex-1 overflow-hidden relative">
            <div className="absolute inset-0 flex flex-col h-full bg-surface-secondary/20">
              {isLoading && transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1">
                  <Spinner size="lg" />
                  <p className="mt-4 text-default-500">Cargando historial...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center flex-1 text-danger">
                  <i className="ri-error-warning-line text-4xl mb-2"></i>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="flex flex-col h-full w-full">
                  <div className="flex-1 overflow-auto w-full [&_table]:w-full">
                    <TableTransactions transactions={transactions} />
                  </div>
                </div>
              )}
            </div>
          </Drawer.Body>
        </Drawer.Dialog>
      </Drawer.Content>
    </Drawer.Backdrop>
  );
};
