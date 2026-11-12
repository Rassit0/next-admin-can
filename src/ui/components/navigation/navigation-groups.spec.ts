import {
  findActiveNavGroup,
  groupNavigationItems,
  NAV_GROUP_DEFINITIONS,
} from "./navigation-groups";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";

describe("navigation-groups", () => {
  it("groups items in canonical functional order and omits empty groups", () => {
    const items: NavItem[] = [
      { label: "Usuarios", href: "users", action: "users", subject: "USERS", group: "admin" },
      { label: "Inicio", href: "dashboard", action: "dashboard", subject: "home", group: "general" },
      { label: "Reportes", href: "reports", action: "reports", subject: "REPORTS", group: "finance" },
      { label: "Personas", href: "members", action: "members", subject: "PERSONS", group: "general" },
      { label: "Equipos", href: "teams", action: "teams", subject: "TEAMS", group: "sports" },
    ];

    const grouped = groupNavigationItems(items);

    expect(grouped.map((g) => g.key)).toEqual(["general", "sports", "finance", "admin"]);
    expect(grouped[0].label).toBe("General");
    expect(grouped[0].items.map((item) => item.label)).toEqual(["Inicio", "Personas"]);
    expect(grouped[1].label).toBe("Deportivo");
    expect(grouped[2].label).toBe("Finanzas");
    expect(grouped[3].label).toBe("Administración");
    expect(NAV_GROUP_DEFINITIONS.map((d) => d.key)).toEqual([
      "general",
      "sports",
      "academic",
      "finance",
      "admin",
    ]);
  });

  it("returns an ungrouped section without header for ungrouped lists (e.g. Web CMS)", () => {
    const webItems: NavItem[] = [
      { label: "Inicio", href: "home", action: "web", subject: "home" },
      { label: "Noticias", href: "news", action: "news", subject: "NEWS" },
    ];

    const grouped = groupNavigationItems(webItems);

    expect(grouped).toHaveLength(1);
    expect(grouped[0]).toEqual({
      key: "ungrouped",
      label: null,
      items: webItems,
    });
  });

  it("handles empty item arrays cleanly", () => {
    expect(groupNavigationItems([])).toEqual([]);
  });

  it("identifies the active group containing the active route", () => {
    const items: NavItem[] = [
      { label: "Inicio", href: "dashboard", action: "dashboard", subject: "home", group: "general" },
      { label: "Cursos", href: "courses", action: "courses", subject: "COURSES", group: "academic" },
    ];
    const sections = groupNavigationItems(items);

    expect(
      findActiveNavGroup(sections, (item) => item.href === "courses"),
    ).toBe("academic");
    expect(
      findActiveNavGroup(sections, () => false),
    ).toBeNull();
  });
});

