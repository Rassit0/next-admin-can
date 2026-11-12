/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MoreMenu } from "./MoreMenu";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement("a", { href, ...rest }, children),
}));

jest.mock("@/ui/components/navigation/IconRegistry", () => ({
  NavigationIcon: ({ iconKey }: { iconKey?: string }) =>
    React.createElement("span", { "data-testid": `icon-${iconKey ?? "none"}` }),
}));

jest.mock("framer-motion", () => {
  const ReactActual = jest.requireActual<typeof import("react")>("react");
  const createMotionTag = (tag: string) => {
    const MotionTag = ReactActual.forwardRef<
      HTMLElement,
      Record<string, unknown> & { children?: React.ReactNode }
    >(({ children, ...props }, ref) => {
      const domProps = { ...props };
      for (const key of [
        "initial",
        "animate",
        "exit",
        "transition",
        "variants",
        "whileHover",
        "whileTap",
        "layoutId",
      ]) {
        delete domProps[key];
      }
      return ReactActual.createElement(
        tag,
        { ...domProps, ref },
        children as React.ReactNode,
      );
    });
    MotionTag.displayName = `motion.${tag}`;
    return MotionTag;
  };

  return {
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      ReactActual.createElement(ReactActual.Fragment, null, children),
    motion: {
      div: createMotionTag("div"),
      nav: createMotionTag("nav"),
    },
    useReducedMotion: () => true,
  };
});

const drawerItems: NavItem[] = [
  {
    id: "quick-operations",
    label: "Operaciones Rápidas",
    href: "quick-operations",
    action: "read",
    subject: "QUICK",
    icon: "quick-operations",
    highlight: true,
  },
  {
    id: "dashboard",
    label: "Inicio",
    href: "dashboard",
    action: "read",
    subject: "home",
    icon: "dashboard",
    group: "general",
  },
  {
    id: "teams",
    label: "Equipos",
    href: "teams",
    action: "read",
    subject: "TEAMS",
    icon: "teams",
    group: "sports",
  },
  {
    id: "courses",
    label: "Cursos",
    href: "courses",
    action: "read",
    subject: "COURSES",
    icon: "courses",
    group: "academic",
  },
];

describe("MoreMenu — App Launcher móvil (Fase D)", () => {
  it("muestra Operaciones Rápidas destacado y cuadrículas de aplicaciones agrupadas con ruta activa", () => {
    const onClose = jest.fn();

    render(
      React.createElement(MoreMenu, {
        isOpen: true,
        onClose,
        items: drawerItems,
        urlBase: "/admin",
        isItemActive: (item) => item.href === "courses",
      }),
    );

    const dialog = screen.getByRole("dialog", { name: /aplicaciones/i });
    expect(dialog).toHaveAttribute("aria-modal", "true");

    expect(
      screen.getByRole("link", { name: /operaciones rápidas/i }),
    ).toHaveAttribute("href", "/admin/quick-operations");

    expect(
      screen.getByRole("heading", { name: "General" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Deportivo" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Académico" }),
    ).toBeInTheDocument();

    const activeTile = screen.getByRole("link", { name: "Cursos" });
    expect(activeTile).toHaveAttribute("aria-current", "page");

    fireEvent.click(activeTile);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cierra con Escape y al pulsar el botón cerrar", () => {
    const onClose = jest.fn();

    render(
      React.createElement(MoreMenu, {
        isOpen: true,
        onClose,
        items: drawerItems,
        urlBase: "/admin",
        isItemActive: () => false,
      }),
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("permite filtrar módulos rápidamente mediante el buscador", () => {
    render(
      React.createElement(MoreMenu, {
        isOpen: true,
        onClose: jest.fn(),
        items: drawerItems,
        urlBase: "/admin",
        isItemActive: () => false,
      }),
    );

    const searchInput = screen.getByRole("searchbox", {
      name: /buscar aplicaciones o módulos/i,
    });
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "equipos" } });
    expect(screen.getByRole("link", { name: "Equipos" })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Inicio" }),
    ).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "inexistente" } });
    expect(screen.getByText(/sin coincidencias/i)).toBeInTheDocument();
  });
});

