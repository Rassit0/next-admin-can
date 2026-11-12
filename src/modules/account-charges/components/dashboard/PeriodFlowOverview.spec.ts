/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PeriodFlowOverview } from "./PeriodFlowOverview";

jest.mock("@/ui", () => ({
  InfoTooltip: () => React.createElement("span", { "data-testid": "info-tooltip" }),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...rest }, children),
}));

describe("PeriodFlowOverview (Análisis del Período — Flujo y Balance)", () => {
  it("muestra balance positivo, dinero recibido y dinero gastado con etiquetas 'Según período'", () => {
    render(
      React.createElement(PeriodFlowOverview, {
        periodResult: 5000,
        monthlyIncome: 15000,
        monthlyExpenses: 10000,
      }),
    );

    expect(screen.getByText("Balance del período")).toBeInTheDocument();
    expect(screen.getByText("+Bs. 5.000,00")).toBeInTheDocument();
    expect(screen.getByText("Entró más de lo que salió")).toBeInTheDocument();

    expect(screen.getByText("Dinero recibido")).toBeInTheDocument();
    expect(screen.getByText("Bs. 15.000,00")).toBeInTheDocument();

    expect(screen.getByText("Dinero gastado")).toBeInTheDocument();
    expect(screen.getByText("Bs. 10.000,00")).toBeInTheDocument();

    // Comprobamos presencia de etiquetas 'Según período'
    const periodBadges = screen.getAllByText("Según período");
    expect(periodBadges.length).toBe(3);

    // Enlaces a transacciones
    const incomeLink = screen.getByRole("link", {
      name: /ver transacciones de ingreso/i,
    });
    expect(incomeLink).toHaveAttribute(
      "href",
      "/admin/accounting/transactions?type=INCOME",
    );

    const expenseLink = screen.getByRole("link", {
      name: /ver transacciones de egreso/i,
    });
    expect(expenseLink).toHaveAttribute(
      "href",
      "/admin/accounting/transactions?type=EXPENSE",
    );
  });

  it("muestra balance negativo con píldora semántica adecuada", () => {
    render(
      React.createElement(PeriodFlowOverview, {
        periodResult: -3200,
        monthlyIncome: 4000,
        monthlyExpenses: 7200,
      }),
    );

    expect(screen.getByText("Salió más de lo que entró")).toBeInTheDocument();
    expect(screen.getByText("Bs. -3.200,00")).toBeInTheDocument();
  });
});
