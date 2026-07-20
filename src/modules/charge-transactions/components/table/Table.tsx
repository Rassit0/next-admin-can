"use client";
import { Chip, Table, Button } from "@heroui/react";
import { useEffect, useState } from "react";
import { SortableColumnHeader } from "@/ui";
import { ICharge } from "@/modules/charge-transactions";
import { PayChargeDrawer } from "../drawer/PayChargeDrawer";
import { ChargeActions } from "../actions/ChargeActions";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Props {
  charges: ICharge[];
  showPerson?: boolean;
}

const formatCurrency = (amount: number | string) => {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
  }).format(value);
};

export const TableCharges = ({ charges, showPerson = false }: Props) => {
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
            {showPerson && (
              <Table.Column allowsSorting isRowHeader id="person">
                <SortableColumnHeader id="person">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    Persona
                  </span>
                </SortableColumnHeader>
              </Table.Column>
            )}
            <Table.Column
              allowsSorting
              isRowHeader={!showPerson}
              id="description"
            >
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
            <Table.Column id="discount" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Descuento
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
                  {showPerson && (
                    <Table.Cell className="py-3">
                      <span className="font-semibold text-foreground">
                        {(() => {
                          if (charge.membershipCharges?.[0]) {
                            const person =
                              charge.membershipCharges[0].playerMembership
                                .player.person;
                            return `${person.name} ${person.lastName}`;
                          }
                          if (charge.studentCharges?.[0]) {
                            const person =
                              charge.studentCharges[0].studentMembership.student
                                .person;
                            return `${person.name} ${person.lastName}`;
                          }
                          return "—";
                        })()}
                      </span>
                    </Table.Cell>
                  )}
                  <Table.Cell className="py-3">
                    <span className="font-semibold text-foreground">
                      {charge.description}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span
                      className={`font-medium ${Number(charge.discountAmount) > 0 ? "text-muted line-through" : "text-foreground"}`}
                    >
                      {formatCurrency(charge.amount)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    {Number(charge.discountAmount) > 0 ? (
                      <div className="flex flex-col items-end gap-0.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-success-50 text-success-700 border border-success-200 text-xs font-bold shadow-sm">
                          -{formatCurrency(Number(charge.discountAmount))}
                        </span>
                        {charge.discountReason && (
                          <span
                            className="text-[10px] text-muted-foreground italic truncate max-w-30"
                            title={charge.discountReason}
                          >
                            "{charge.discountReason}"
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted/50">-</span>
                    )}
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span
                      className={`font-bold tabular-nums text-[15px] ${Number(charge.pendingAmount) <= 0 ? "text-success-600" : "text-primary-700"}`}
                    >
                      {formatCurrency(charge.pendingAmount)}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-sm">
                    {new Date(charge.dueDate) < new Date() &&
                    charge.status !== "PAID" ? (
                      <span className="text-danger-600 font-semibold bg-danger-50 px-2 py-0.5 rounded border border-danger-100">
                        {new Date(charge.dueDate).toLocaleDateString("es-BO")}
                      </span>
                    ) : (
                      <span className="text-foreground/80 font-medium">
                        {new Date(charge.dueDate).toLocaleDateString("es-BO")}
                      </span>
                    )}
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
                      {(() => {
                        const membershipId =
                          charge.membershipCharges?.[0]?.playerMembership?.id ||
                          charge.studentCharges?.[0]?.studentMembership?.id ||
                          params?.playerMembershipId;

                        const detailsHref =
                          params?.disciplineId && membershipId
                            ? `/admin/teams/${params.disciplineId}/${params.clubId}/${params.teamId}/team-seasons/${params.teamSeasonId}/player-memberships/${membershipId}/${charge.id}/transactions`
                            : undefined;

                        return (
                          <ChargeActions
                            charge={charge}
                            onPay={(c) => setSelectedCharge(c)}
                            detailsHref={detailsHref}
                          />
                        );
                      })()}
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
