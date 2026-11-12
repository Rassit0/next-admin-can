/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import {
  GeneralEconomicOverview,
  AccountSummaryItem,
} from "./GeneralEconomicOverview";

jest.mock("@/ui", () => ({
  InfoTooltip: () => React.createElement("span", { "data-testid": "info-tooltip" }),
}));

describe("GeneralEconomicOverview (Resumen Económico — Bloque A)", () => {
  const sampleAccounts: AccountSummaryItem[] = [
    {
      id: "acc-1",
      name: "Caja Chica Central",
      type: "CASH",
      currency: "BOB",
      isActive: true,
      balance: 5000,
    },
    {
      id: "acc-2",
      name: "Banco Unión Cta Cte",
      type: "BANK",
      currency: "BOB",
      isActive: true,
      balance: 25000,
    },
    {
      id: "acc-3",
      name: "Caja Inactiva",
      type: "CASH",
      currency: "BOB",
      isActive: false,
      balance: 1000,
    },
    {
      id: "acc-4",
      name: "Cuenta Dólares",
      type: "BANK",
      currency: "USD",
      isActive: true,
      balance: 1200,
    },
  ];

  it("renderiza el saldo disponible consolidado en BOB con desglose de cajas y bancos activos", () => {
    render(
      React.createElement(GeneralEconomicOverview, {
        availableBalance: 30000,
        periodResult: 6000,
        monthlyIncome: 16000,
        monthlyExpenses: 10000,
        accounts: sampleAccounts,
      }),
    );

    expect(screen.getByText("Dinero disponible hoy")).toBeInTheDocument();
    expect(screen.getByText("Bs. 30.000,00")).toBeInTheDocument();

    // Aclaración frente al filtro de fechas
    expect(
      screen.getByText(
        /Saldo actual al día de hoy\. Este importe no cambia al modificar el período seleccionado\./i,
      ),
    ).toBeInTheDocument();

    // Desglose: Caja activa = 5.000, Banco activo = 25.000
    expect(screen.getByText("Cajas físicas:")).toBeInTheDocument();
    expect(screen.getByText("Bs. 5.000,00")).toBeInTheDocument();

    expect(screen.getByText("Bancos y billeteras:")).toBeInTheDocument();
    expect(screen.getByText("Bs. 25.000,00")).toBeInTheDocument();

    // Cuenta USD en otra divisa informada
    expect(
      screen.getByText("(+1 cuenta en otra divisa)"),
    ).toBeInTheDocument();
  });

  it("muestra estado semántico positivo cuando entró más dinero del que salió", () => {
    render(
      React.createElement(GeneralEconomicOverview, {
        availableBalance: 20000,
        periodResult: 4500,
        monthlyIncome: 12000,
        monthlyExpenses: 7500,
        accounts: [],
      }),
    );

    expect(
      screen.getByText("Entró más de lo que salió"),
    ).toBeInTheDocument();
    expect(screen.getByText("+Bs. 4.500,00")).toBeInTheDocument();
    expect(screen.getByText("Bs. 12.000,00")).toBeInTheDocument();
    expect(screen.getByText("Bs. 7.500,00")).toBeInTheDocument();
  });

  it("muestra estado semántico negativo cuando salió más dinero del que entró", () => {
    render(
      React.createElement(GeneralEconomicOverview, {
        availableBalance: 15000,
        periodResult: -3000,
        monthlyIncome: 5000,
        monthlyExpenses: 8000,
        accounts: [],
      }),
    );

    expect(
      screen.getByText("Salió más de lo que entró"),
    ).toBeInTheDocument();
    expect(screen.getByText("Bs. -3.000,00")).toBeInTheDocument();
  });

  it("muestra estado semántico neutro cuando entradas y salidas están equilibradas", () => {
    render(
      React.createElement(GeneralEconomicOverview, {
        availableBalance: 10000,
        periodResult: 0,
        monthlyIncome: 5000,
        monthlyExpenses: 5000,
        accounts: [],
      }),
    );

    expect(
      screen.getByText("Entradas y salidas equilibradas"),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Bs. 0,00").length).toBeGreaterThanOrEqual(1);
  });
});

