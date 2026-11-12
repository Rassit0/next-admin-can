/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { GlobalFooter } from "./GlobalFooter";
import {
  APP_NAME,
  APP_AUTHOR,
  APP_SYSTEM_NAME,
  APP_YEAR,
  APP_VERSION,
} from "@/config/version";

describe("GlobalFooter", () => {
  it("renders the institutional footer with all required metadata", () => {
    render(React.createElement(GlobalFooter));

    expect(screen.getByText(APP_NAME)).toBeInTheDocument();
    expect(screen.getByText(APP_SYSTEM_NAME)).toBeInTheDocument();
    expect(screen.getByText(APP_AUTHOR)).toBeInTheDocument();
    expect(
      screen.getByText(`© ${APP_YEAR} · Todos los derechos reservados`),
    ).toBeInTheDocument();
    expect(screen.getByText(`v${APP_VERSION}`)).toBeInTheDocument();
  });
});

