"use client";
import { Chip, Table, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { SortableColumnHeader } from "@/ui";
import { ICharge } from "@/modules/charge-transactions";
import { PayChargeDrawer } from "../drawer/PayChargeDrawer";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Props {
  charges: ICharge[];
}

const formatCurrency = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
  }).format(value);
};

export const TableCharges = ({ charges }: Props) => {
  const [isClient, setIsClient] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<ICharge | null>(null);
  const params = useParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PARTIAL":
        return "warning";
      case "PENDING":
        return "danger";
      case "CANCELLED":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return "Pagado";
      case "PARTIAL":
        return "Parcial";
      case "PENDING":
        return "Pendiente";
      case "CANCELLED":
        return "Cancelado";
      default:
        return status;
    }
  };

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content
          aria-label="Cargos de la membresía"
          className="min-w-200"
        >
          <Table.Header className="bg-surface-secondary">
            <Table.Column allowsSorting isRowHeader id="description">
              <SortableColumnHeader id="description">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Concepto
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="amount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Monto
              </span>
            </Table.Column>
            <Table.Column id="pendingAmount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Pendiente
              </span>
            </Table.Column>
            <Table.Column allowsSorting id="dueDate">
              <SortableColumnHeader id="dueDate">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Vencimiento
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="status">
              <SortableColumnHeader id="status">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Estado
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Acciones
              </span>
            </Table.Column>
          </Table.Header>
          <Table.Body
            renderEmptyState={() => (
              <div className="py-10 text-center text-sm text-muted">
                No hay cargos registrados.
              </div>
            )}
          >
            {charges.map((charge) => {
              return (
                <Table.Row
                  key={charge.id}
                  id={charge.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                >
                  <Table.Cell className="py-3">
                    <span className="font-medium text-foreground">
                      {charge.description}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-medium">
                      {formatCurrency(charge.amount)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-semibold tabular-nums text-accent">
                      {formatCurrency(charge.pendingAmount)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-sm">
                    {new Date(charge.dueDate).toLocaleDateString("es-BO")}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <Chip
                      color={getStatusColor(charge.status)}
                      variant="soft"
                      size="sm"
                      className="font-medium"
                    >
                      {getStatusLabel(charge.status)}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex items-center justify-center gap-2">
                      {charge.status === "PENDING" || charge.status === "PARTIAL" ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => setSelectedCharge(charge)}
                        >
                          Pagar
                        </Button>
                      ) : null}
                      {params?.disciplineId && (
                        <Link
                          href={`/admin/teams/${params.disciplineId}/${params.clubId}/${params.teamId}/team-seasons/${params.teamSeasonId}/player-memberships/${params.playerMembershipId}/${charge.id}/transactions`}
                        >
                          <Button size="sm" variant="secondary" className="px-3">
                            Ver detalles
                          </Button>
                        </Link>
                      )}
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
      {selectedCharge && (
        <PayChargeDrawer
          isOpen={!!selectedCharge}
          onOpenChange={(isOpen) => !isOpen && setSelectedCharge(null)}
          charge={selectedCharge}
        />
      )}
    </Table>
  );
};
