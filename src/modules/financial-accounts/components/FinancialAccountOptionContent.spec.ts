/**
 * @jest-environment jsdom
 */
import React from "react";
import { render } from "@testing-library/react";
import {
  FinancialAccountOptionContent,
  formatAccountBalance,
  parseAccountBalance,
} from "./FinancialAccountOptionContent";

describe("FinancialAccountOptionContent helpers", () => {
  it("parses numeric, string decimal, zero, negative, and empty balances safely", () => {
    expect(parseAccountBalance(25450)).toBe(25450);
    expect(parseAccountBalance("25450.50")).toBe(25450.5);
    expect(parseAccountBalance(-150.25)).toBe(-150.25);
    expect(parseAccountBalance(0)).toBe(0);
    expect(parseAccountBalance("0")).toBe(0);
    expect(parseAccountBalance(null)).toBeNull();
    expect(parseAccountBalance(undefined)).toBeNull();
    expect(parseAccountBalance("")).toBeNull();
    expect(parseAccountBalance("not-a-number")).toBeNull();
  });

  it("formats balances using the Dashboard es-BO currency convention", () => {
    const bobExpected = new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB",
    }).format(25450);
    const usdExpected = new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "USD",
    }).format(-120.5);

    expect(formatAccountBalance("25450", "BOB")).toBe(bobExpected);
    expect(formatAccountBalance(-120.5, "USD")).toBe(usdExpected);
    expect(formatAccountBalance(null, "BOB")).toBeNull();
    expect(formatAccountBalance(100, "INVALID_CUR")).toBe("INVALID_CUR 100.00");
  });
});

describe("FinancialAccountOptionContent component", () => {
  it("renders positive balance with primary hierarchy and 'Saldo actual' subtitle", () => {
    const { container, getByText } = render(
      React.createElement(FinancialAccountOptionContent, {
        account: {
          id: "acc-1",
          name: "Caja Central",
          type: "CASH",
          currency: "BOB",
          cachedBalance: "25450.00",
        },
      }),
    );

    const expectedBalance = formatAccountBalance("25450.00", "BOB")!;
    expect(getByText("Caja Central")).toBeTruthy();
    const balanceEl = getByText(
      (_, el) => el?.tagName === "SPAN" && el.textContent === expectedBalance,
    );
    expect(balanceEl.className).toContain("text-foreground");
    expect(getByText("Caja · Saldo actual")).toBeTruthy();
    expect(container.textContent).not.toContain("NaN");
  });

  it("renders zero balance with muted styling", () => {
    const { getByText } = render(
      React.createElement(FinancialAccountOptionContent, {
        account: {
          id: "acc-2",
          name: "Banco Unión",
          type: "BANK",
          currency: "BOB",
          cachedBalance: 0,
        },
      }),
    );

    const expectedBalance = formatAccountBalance(0, "BOB")!;
    const balanceEl = getByText(
      (_, el) => el?.tagName === "SPAN" && el.textContent === expectedBalance,
    );
    expect(balanceEl.className).toContain("text-default-400");
    expect(getByText("Banco · Saldo actual")).toBeTruthy();
  });

  it("renders negative balance with danger styling", () => {
    const { getByText } = render(
      React.createElement(FinancialAccountOptionContent, {
        account: {
          id: "acc-3",
          name: "QR Bancario",
          type: "DIGITAL_WALLET",
          currency: "BOB",
          cachedBalance: -350.75,
        },
      }),
    );

    const expectedBalance = formatAccountBalance(-350.75, "BOB")!;
    const balanceEl = getByText(
      (_, el) => el?.tagName === "SPAN" && el.textContent === expectedBalance,
    );
    expect(balanceEl.className).toContain("text-danger");
    expect(getByText("Billetera Digital · Saldo actual")).toBeTruthy();
  });

  it("gracefully omits balance and 'Saldo actual' when cachedBalance is unavailable", () => {
    const { getByText, queryByText } = render(
      React.createElement(FinancialAccountOptionContent, {
        account: {
          id: "acc-4",
          name: "Cuenta Legacy",
        },
      }),
    );

    expect(getByText("Cuenta Legacy")).toBeTruthy();
    expect(getByText("Cuenta contable")).toBeTruthy();
    expect(queryByText(/Saldo actual/)).toBeNull();
  });
});
