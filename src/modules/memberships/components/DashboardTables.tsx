"use client";

import { Card, Table, Chip, Tabs } from "@heroui/react";
import { formatCurrency } from "@/utils/constants";

interface DashboardTablesProps {
  topDebtors: {
    id: string;
    debt: number;
    dueDate: string;
    personName: string;
    type: string;
    phone: string;
  }[];
  recentPayments: {
    id: string;
    amount: number;
    date: string;
    payerName: string;
    method: string;
  }[];
  upcomingCharges: {
    id: string;
    amount: number;
    dueDate: string;
    personName: string;
    type: string;
  }[];
}

export const DashboardTables = ({
  topDebtors,
  recentPayments,
  upcomingCharges,
}: DashboardTablesProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm flex flex-col">
        <Tabs>
          <Card.Header className="px-6 pt-6 pb-2">
            <Tabs.List>
              <Tabs.Tab id="debtors">Deudores</Tabs.Tab>
              <Tabs.Tab id="upcoming">Próximos Cobros</Tabs.Tab>
            </Tabs.List>
          </Card.Header>

          <div className="px-6 pb-6 pt-0 flex-1">
            <Tabs.Panel id="debtors">
              <Table aria-label="Top deudores" className="mt-2">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column isRowHeader>NOMBRE</Table.Column>
                      <Table.Column>TIPO</Table.Column>
                      <Table.Column>DEUDA</Table.Column>
                      <Table.Column>VENCE</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {topDebtors.length === 0 ? (
                        <Table.Row>
                          <Table.Cell
                            colSpan={4}
                            className="text-center text-default-500 py-4"
                          >
                            No hay deudores registrados.
                          </Table.Cell>
                        </Table.Row>
                      ) : (
                        topDebtors.map((debtor) => (
                          <Table.Row key={debtor.id}>
                            <Table.Cell>
                              <div className="flex flex-col">
                                <span className="text-sm font-medium">
                                  {debtor.personName}
                                </span>
                                <span className="text-xs text-default-400">
                                  {debtor.phone}
                                </span>
                              </div>
                            </Table.Cell>
                            <Table.Cell>
                              <Chip
                                size="sm"
                                variant="soft"
                                color={
                                  debtor.type === "Jugador" ? "accent" : "default"
                                }
                              >
                                {debtor.type}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell className="text-danger font-semibold">
                              {formatCurrency(debtor.debt)}
                            </Table.Cell>
                            <Table.Cell className="text-default-500 text-sm">
                              {new Date(debtor.dueDate).toLocaleDateString()}
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Tabs.Panel>

            <Tabs.Panel id="upcoming">
              <Table aria-label="Próximos cobros" className="mt-2">
                <Table.ScrollContainer>
                  <Table.Content>
                    <Table.Header>
                      <Table.Column isRowHeader>NOMBRE</Table.Column>
                      <Table.Column>TIPO</Table.Column>
                      <Table.Column>MONTO</Table.Column>
                      <Table.Column>VENCE</Table.Column>
                    </Table.Header>
                    <Table.Body>
                      {upcomingCharges.length === 0 ? (
                        <Table.Row>
                          <Table.Cell
                            colSpan={4}
                            className="text-center text-default-500 py-4"
                          >
                            No hay próximos cobros registrados.
                          </Table.Cell>
                        </Table.Row>
                      ) : (
                        upcomingCharges.map((charge) => (
                          <Table.Row key={charge.id}>
                            <Table.Cell className="font-medium text-sm">
                              {charge.personName}
                            </Table.Cell>
                            <Table.Cell>
                              <Chip
                                size="sm"
                                variant="soft"
                                color={
                                  charge.type === "Jugador" ? "accent" : "default"
                                }
                              >
                                {charge.type}
                              </Chip>
                            </Table.Cell>
                            <Table.Cell className="text-foreground font-semibold">
                              {formatCurrency(charge.amount)}
                            </Table.Cell>
                            <Table.Cell className="text-default-500 text-sm">
                              {new Date(charge.dueDate).toLocaleDateString()}
                            </Table.Cell>
                          </Table.Row>
                        ))
                      )}
                    </Table.Body>
                  </Table.Content>
                </Table.ScrollContainer>
              </Table>
            </Tabs.Panel>
          </div>
        </Tabs>
      </Card>

      <Card className="border-none bg-background/60 dark:bg-default-100/50 shadow-sm flex flex-col">
        <Card.Header className="px-6 pt-6">
          <Card.Title className="text-lg font-semibold">
            Últimos Pagos
          </Card.Title>
        </Card.Header>
        <div className="px-6 pb-6 pt-0 flex-1">
          <Table aria-label="Últimos pagos" className="mt-2">
            <Table.ScrollContainer>
              <Table.Content>
                <Table.Header>
                  <Table.Column isRowHeader>PAGADOR</Table.Column>
                  <Table.Column>MÉTODO</Table.Column>
                  <Table.Column>MONTO</Table.Column>
                  <Table.Column>FECHA</Table.Column>
                </Table.Header>
                <Table.Body>
                  {recentPayments.length === 0 ? (
                    <Table.Row>
                      <Table.Cell
                        colSpan={4}
                        className="text-center text-default-500 py-4"
                      >
                        No hay pagos recientes.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    recentPayments.map((payment) => (
                      <Table.Row key={payment.id}>
                        <Table.Cell className="font-medium text-sm">
                          {payment.payerName}
                        </Table.Cell>
                        <Table.Cell>
                          <Chip size="sm" variant="soft" color="success">
                            {payment.method}
                          </Chip>
                        </Table.Cell>
                        <Table.Cell className="text-success font-semibold">
                          {formatCurrency(payment.amount)}
                        </Table.Cell>
                        <Table.Cell className="text-default-500 text-sm">
                          {new Date(payment.date).toLocaleDateString()}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </div>
      </Card>
    </div>
  );
};
