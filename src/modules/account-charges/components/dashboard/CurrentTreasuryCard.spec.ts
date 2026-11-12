/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import {
  CurrentTreasuryCard,
  AccountSummaryItem,
} from "./CurrentTreasuryCard";

jest.mock("@/ui", () => ({
  InfoTooltip: () => React.createElement("span", { "data-testid": "info-tooltip" }),
}));

describe("CurrentTreasuryCard (Situación Actual — Tesorería y Stock)", () => {
  const sampleAccounts: AccountSummaryItem[] = [
    {
      id: "acc-1",
      name: "Caja Chica Central",
      type: "CASH",
      currency: "BOB",
      isActive: true,
      balance: 4000,
    },
    {
      id: "acc-2",
      name: "Banco Nacional",
      type: "BANK",
      currency: "BOB",
      isActive: true,
      balance: 16000,
    },
    {
      id: "acc-3",
      name: "Cuenta Moneda Extranjera",
      type: "BANK",
      currency: "USD",
      isActive: true,
      balance: 500,
    },
  ];

  it("renderiza el importe disponible, aclaración de saldo al día y desglose por tipo de cuenta", () => {
    render(
      React.createElement(CurrentTreasuryCard, {
        availableBalance: 20000,
        accounts: sampleAccounts,
      }),
    );

    expect(screen.getByText("Dinero disponible hoy")).toBeInTheDocument();
    expect(screen.getByText("Bs. 20.000,00")).toBeInTheDocument();

    // Aclaración obligatoria
    expect(
      screen.getByText(
        /Saldo actual al día de hoy\. Este importe no cambia al modificar el período seleccionado\./i,
      ),
    ).toBeInTheDocument();

    // Cajas y bancos
    expect(screen.getByText("Cajas físicas:")).toBeInTheDocument();
    expect(screen.getByText("Bs. 4.000,00")).toBeInTheDocument();

    expect(screen.getByText("Bancos y billeteras:")).toBeInTheDocument();
    expect(screen.getByText("Bs. 16.000,00")).toBeInTheDocument();

    expect(
      screen.getByText("(+1 cuenta en otra divisa)"),
    ).toBeInTheDocument();
  });
});

