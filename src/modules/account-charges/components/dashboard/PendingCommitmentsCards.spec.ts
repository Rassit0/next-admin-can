/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { PendingCommitmentsCards } from "./PendingCommitmentsCards";

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

describe("PendingCommitmentsCards (Resumen Económico — Bloque B)", () => {
  it("muestra importes de cobros y compromisos de pago con enlaces directos y sin tendencias falsas", () => {
    render(
      React.createElement(PendingCommitmentsCards, {
        totalReceivables: 18450.5,
        totalPayables: 6200,
      }),
    );

    expect(screen.getByText("Pendiente de cobro")).toBeInTheDocument();
    expect(screen.getByText("Bs. 18.450,50")).toBeInTheDocument();

    expect(screen.getByText("Compromisos de pago")).toBeInTheDocument();
    expect(screen.getByText("Bs. 6.200,00")).toBeInTheDocument();

    const receivablesLink = screen.getByRole("link", {
      name: /ver cuentas por cobrar/i,
    });
    expect(receivablesLink).toHaveAttribute(
      "href",
      "/admin/accounting/receivables",
    );

    const payablesLink = screen.getByRole("link", {
      name: /ver cuentas por pagar/i,
    });
    expect(payablesLink).toHaveAttribute(
      "href",
      "/admin/accounting/payables",
    );

    // Asegurar que no hay porcentajes ficticios (ni +5% ni -2%)
    expect(screen.queryByText(/5%/)).not.toBeInTheDocument();
    expect(screen.queryByText(/2%/)).not.toBeInTheDocument();
  });
});

