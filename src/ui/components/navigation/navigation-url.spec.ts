import {
  isNavigationItemActive,
  resolveNavigationHref,
} from "./navigation-url";

describe("navigation-url helpers", () => {
  describe("resolveNavigationHref", () => {
    it("prefixes relative module hrefs with urlBase cleanly", () => {
      expect(resolveNavigationHref("dashboard", "/admin")).toBe(
        "/admin/dashboard",
      );
      expect(resolveNavigationHref("accounting/cash-flow", "/admin/")).toBe(
        "/admin/accounting/cash-flow",
      );
      expect(resolveNavigationHref("hero-banners", "/admin/web")).toBe(
        "/admin/web/hero-banners",
      );
    });

    it("preserves absolute routes across shells without duplicating urlBase", () => {
      expect(resolveNavigationHref("/", "/admin")).toBe("/");
      expect(resolveNavigationHref("/teacher", "/admin")).toBe("/teacher");
      expect(resolveNavigationHref("/admin/profile", "/admin")).toBe(
        "/admin/profile",
      );
    });

    it("handles empty href and external URLs safely", () => {
      expect(resolveNavigationHref("", "/admin")).toBe("/admin");
      expect(resolveNavigationHref("", undefined)).toBe("/");
      expect(resolveNavigationHref("https://example.com", "/admin")).toBe(
        "https://example.com",
      );
      expect(resolveNavigationHref("clubs", undefined)).toBe("clubs");
    });
  });

  describe("isNavigationItemActive", () => {
    it("matches relative admin routes and subroutes accurately", () => {
      expect(
        isNavigationItemActive("/admin/dashboard", "dashboard", "/admin"),
      ).toBe(true);
      expect(
        isNavigationItemActive(
          "/admin/accounting/cash-flow",
          "accounting/dashboard",
          "/admin",
        ),
      ).toBe(true);
      expect(
        isNavigationItemActive("/admin/teams/1/2", "teams", "/admin"),
      ).toBe(true);
    });

    it("does not falsely activate root portal or teacher routes inside /admin", () => {
      expect(isNavigationItemActive("/admin", "/", "/admin")).toBe(false);
      expect(isNavigationItemActive("/admin/dashboard", "/", "/admin")).toBe(
        false,
      );
      expect(
        isNavigationItemActive("/admin/dashboard", "/teacher", "/admin"),
      ).toBe(false);
      expect(isNavigationItemActive("/", "/", "/admin")).toBe(true);
      expect(
        isNavigationItemActive("/teacher/groups", "/teacher", "/admin"),
      ).toBe(true);
    });

    it("respects ?from= context overrides only for matching module items", () => {
      expect(
        isNavigationItemActive(
          "/admin/memberships/123",
          "teams",
          "/admin",
          "teams",
        ),
      ).toBe(true);
      expect(
        isNavigationItemActive(
          "/admin/memberships/123",
          "memberships/player-memberships",
          "/admin",
          "teams",
        ),
      ).toBe(false);
      expect(
        isNavigationItemActive("/admin/memberships/123", "/", "/admin", "teams"),
      ).toBe(false);
    });
  });
});

