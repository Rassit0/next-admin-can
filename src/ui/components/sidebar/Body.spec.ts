/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { Body } from "./Body";
import { resetSidebarOpenGroups } from "./useSidebarPrefs";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

let mockPathname = "/admin";
let mockFromParam: string | null = null;

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => ({
    get: (key: string) => (key === "from" ? mockFromParam : null),
  }),
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

jest.mock("@/ui/components/navigation/IconRegistry", () => ({
  NavigationIcon: ({ iconKey }: { iconKey?: string }) =>
    React.createElement("span", { "data-testid": `icon-${iconKey ?? "none"}` }),
}));

const sampleItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Inicio",
    href: "dashboard",
    action: "dashboard",
    subject: "home",
    icon: "dashboard",
    group: "general",
  },
  {
    id: "teams",
    label: "Equipos",
    href: "teams",
    action: "teams",
    subject: "TEAMS",
    icon: "teams",
    group: "sports",
  },
  {
    id: "courses",
    label: "Cursos",
    href: "courses",
    action: "courses",
    subject: "COURSES",
    icon: "courses",
    group: "academic",
  },
  {
    id: "accounting",
    label: "Contabilidad",
    href: "accounting",
    action: "accounting",
    subject: "ACCOUNT_CHARGES",
    icon: "accounting",
    group: "finance",
  },
  {
    id: "reports",
    label: "Reportes",
    href: "reports",
    action: "reports",
    subject: "REPORTS",
    icon: "news",
    group: "finance",
  },
  {
    id: "users",
    label: "Usuarios",
    href: "users",
    action: "users",
    subject: "USERS",
    icon: "users",
    group: "admin",
  },
];

describe("Sidebar Body — comportamiento controlado de secciones (Fase D)", () => {
  beforeEach(() => {
    mockPathname = "/admin";
    mockFromParam = null;
    window.localStorage.clear();
    resetSidebarOpenGroups();
  });

  it("1. inicia con todas las secciones cerradas si la ruta actual no pertenece a ningún grupo", () => {
    render(React.createElement(Body, { items: sampleItems, urlBase: "/admin" }));

    for (const label of [
      "General",
      "Deportivo",
      "Académico",
      "Finanzas",
      "Administración",
    ]) {
      const btn = screen.getByRole("button", { name: label });
      expect(btn).toHaveAttribute("aria-expanded", "false");
    }
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("2. abre automáticamente solo la sección de la ruta activa (Académico)", () => {
    mockPathname = "/admin/courses/123";
    render(React.createElement(Body, { items: sampleItems, urlBase: "/admin" }));

    expect(
      screen.getByRole("button", { name: "Académico" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Cursos" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    for (const closedLabel of [
      "General",
      "Deportivo",
      "Finanzas",
      "Administración",
    ]) {
      expect(
        screen.getByRole("button", { name: closedLabel }),
      ).toHaveAttribute("aria-expanded", "false");
    }
  });

  it("3 y 4. permite abrir manualmente Finanzas y mantenerla abierta al navegar dentro de Finanzas", () => {
    mockPathname = "/admin/courses";
    const { rerender } = render(
      React.createElement(Body, { items: sampleItems, urlBase: "/admin" }),
    );

    const financeBtn = screen.getByRole("button", { name: "Finanzas" });
    expect(financeBtn).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(financeBtn);
    expect(financeBtn).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("link", { name: "Contabilidad" }),
    ).toBeInTheDocument();

    mockPathname = "/admin/accounting/dashboard";
    rerender(
      React.createElement(Body, { items: sampleItems, urlBase: "/admin" }),
    );
    expect(
      screen.getByRole("button", { name: "Finanzas" }),
    ).toHaveAttribute("aria-expanded", "true");

    mockPathname = "/admin/reports/general";
    rerender(
      React.createElement(Body, { items: sampleItems, urlBase: "/admin" }),
    );
    expect(
      screen.getByRole("button", { name: "Finanzas" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("5. al cambiar de ruta activa hacia Deportivo, abre Deportivo y retira la apertura forzada de Finanzas", () => {
    mockPathname = "/admin/accounting/dashboard";
    const { rerender } = render(
      React.createElement(Body, { items: sampleItems, urlBase: "/admin" }),
    );

    expect(
      screen.getByRole("button", { name: "Finanzas" }),
    ).toHaveAttribute("aria-expanded", "true");

    mockPathname = "/admin/teams";
    rerender(
      React.createElement(Body, { items: sampleItems, urlBase: "/admin" }),
    );

    expect(
      screen.getByRole("button", { name: "Deportivo" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("button", { name: "Finanzas" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("6. no abre ninguna sección automáticamente al navegar a una ruta sin grupo", () => {
    mockPathname = "/admin/quick-operations";
    render(React.createElement(Body, { items: sampleItems, urlBase: "/admin" }));

    for (const label of [
      "General",
      "Deportivo",
      "Académico",
      "Finanzas",
      "Administración",
    ]) {
      expect(screen.getByRole("button", { name: label })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    }
  });

  it("7. ignora y limpia preferencias heredadas antiguas sin abrir secciones automáticamente", () => {
    window.localStorage.setItem(
      "can-admin-sidebar-collapsed-groups",
      JSON.stringify(["sports", "admin"]),
    );
    mockPathname = "/admin";

    render(React.createElement(Body, { items: sampleItems, urlBase: "/admin" }));

    expect(
      screen.getByRole("button", { name: "Deportivo" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "Administración" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      window.localStorage.getItem("can-admin-sidebar-collapsed-groups"),
    ).toBeNull();
  });

  it("8. permite abrir/cerrar manualmente secciones inactivas e impide cerrar la sección de la ruta activa", () => {
    mockPathname = "/admin/courses";
    render(React.createElement(Body, { items: sampleItems, urlBase: "/admin" }));

    const academicBtn = screen.getByRole("button", { name: "Académico" });
    fireEvent.click(academicBtn);
    expect(academicBtn).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Cursos" })).toBeInTheDocument();

    const adminBtn = screen.getByRole("button", { name: "Administración" });
    fireEvent.click(adminBtn);
    expect(adminBtn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(adminBtn);
    expect(adminBtn).toHaveAttribute("aria-expanded", "false");
  });

  it("9. en modo compacto muestra los accesos con etiquetas accesibles y sin accordions de texto", () => {
    mockPathname = "/admin/courses";
    render(
      React.createElement(Body, {
        items: sampleItems,
        urlBase: "/admin",
        isCollapsed: true,
      }),
    );

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cursos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByRole("link", { name: "Contabilidad" }),
    ).toBeInTheDocument();
  });

  it("10. hidrata en cliente sin discrepancias ni errores respecto al HTML SSR", async () => {
    mockPathname = "/admin/courses";
    const element = React.createElement(Body, {
      items: sampleItems,
      urlBase: "/admin",
    });
    const html = renderToString(element);
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    let root: ReturnType<typeof hydrateRoot> | null = null;
    await React.act(async () => {
      root = hydrateRoot(container, element);
    });

    expect(errorSpy).not.toHaveBeenCalled();

    errorSpy.mockRestore();
    if (root) {
      await React.act(async () => {
        (root as NonNullable<typeof root>).unmount();
      });
    }
    container.remove();
  });
});

