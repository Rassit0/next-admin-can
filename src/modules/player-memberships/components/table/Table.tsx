"use client";
import { Avatar, Table } from "@heroui/react";
import { useEffect, useState } from "react";
import { SortableColumnHeader } from "@/ui";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPlayerMembership } from "@/modules/player-memberships";
import { StatusChip } from "@/modules/player-memberships/components/status/StatusChip";
import { MembershipActions } from "@/modules/player-memberships/components/actions/MembershipActions";
import {
  calculateInitialCharges,
  formatCurrency,
} from "@/modules/player-memberships/helpers/initial-charges";

interface Props {
  memberships: IPlayerMembership[];
  teamSeason: ITeamSeason;
}

const initials = (name: string, lastName: string) =>
  `${name?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

export const TableMemberships = ({ memberships, teamSeason }: Props) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <Table>
      <Table.ScrollContainer>
        <Table.Content aria-label="Membresías de atletas" className="min-w-200">
          <Table.Header className="bg-surface-secondary">
            <Table.Column isRowHeader allowsSorting id="player">
              <SortableColumnHeader id="player">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Atleta
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column allowsSorting id="paymentPlan">
              <SortableColumnHeader id="paymentPlan">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Plan de Pago
                </span>
              </SortableColumnHeader>
            </Table.Column>
            <Table.Column id="initialCharges" className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wide">
                Cargos
              </span>
            </Table.Column>
            <Table.Column allowsSorting id="startedAt">
              <SortableColumnHeader id="startedAt">
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Inicio
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
                Aún no hay atletas inscritos en esta temporada.
              </div>
            )}
          >
            {memberships.map((membership) => {
              const person = membership.player?.person;
              const charges = calculateInitialCharges(
                teamSeason,
                membership.paymentPlan,
              );
              return (
                <Table.Row
                  key={membership.id}
                  id={membership.id}
                  className="border-b border-border last:border-b-0 hover:bg-surface-secondary/40"
                >
                  <Table.Cell className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <Avatar.Image
                          alt={person?.name ?? "Atleta"}
                          src={person?.imageUrl ?? undefined}
                          loading="lazy"
                        />
                        <Avatar.Fallback className="bg-accent-soft text-accent">
                          {person
                            ? initials(person.name, person.lastName)
                            : "AT"}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {person
                            ? `${person.name} ${person.lastName}`
                            : "Atleta"}
                        </span>
                        {person ? (
                          <span className="text-xs text-muted truncate">
                            {person.documentType} {person.documentNumber}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <span className="font-medium text-foreground">
                      {membership.paymentPlan?.name ?? "—"}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-right">
                    <span className="font-semibold tabular-nums text-accent">
                      {formatCurrency(membership.totalPendingAmount, "BOB")}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="py-3 text-sm">
                    {membership.startedAt.toLocaleDateString("es-BO")}
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <StatusChip status={membership.status} />
                  </Table.Cell>
                  <Table.Cell className="py-3">
                    <div className="flex items-center justify-center">
                      <MembershipActions membership={membership} />
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
};
