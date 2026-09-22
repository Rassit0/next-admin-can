import { hasModuleAccess } from "./navigation-access";

jest.mock("@/config/navigation", () => ({
  allowedNavigation: [
    {
      id: "dashboard",
      title: "Dashboard",
      path: "/admin",
    },
    {
      id: "users",
      title: "Usuarios",
      path: "/admin/users",
      requiredPermissions: { anyOf: ["READ_USERS", "READ_ROLES"] },
    },
    {
      id: "accounting",
      title: "Accounting",
      path: "/admin/accounting",
      requiredPermissions: { anyOf: ["READ_ACCOUNT_CHARGES", "READ_TRANSACTIONS"] },
      routes: [
        {
          id: "accounting-categories",
          href: "/admin/accounting/categories",
          requiredPermissions: { anyOf: ["READ_ACCOUNT_CATEGORIES"] },
        },
        {
          id: "accounting-cash-flow",
          href: "/admin/accounting/cash-flow",
          requiredPermissions: { anyOf: ["READ_ACCOUNT_CHARGES", "READ_TRANSACTIONS"] },
        }
      ]
    }
  ],
}));

describe("hasModuleAccess", () => {
  it("should allow access if module has no required permissions (like dashboard)", () => {
    const result = hasModuleAccess("dashboard", []);
    expect(result).toBe(true);
  });

  it("should allow access if user has required permissions", () => {
    const result = hasModuleAccess("users", ["READ_USERS"]);
    expect(result).toBe(true);
  });

  it("should deny access if user lacks required permissions", () => {
    const result = hasModuleAccess("users", ["READ_OTHER_THING"]);
    expect(result).toBe(false);
  });

  it("should deny access (fail-closed) if module is not found", () => {
    const result = hasModuleAccess("non-existent-module", ["SUPER_ADMIN"]);
    expect(result).toBe(false);
  });

  it("should allow parent access if user has ANY of the parent permissions", () => {
    const result = hasModuleAccess("accounting", ["READ_ACCOUNT_CHARGES"]);
    expect(result).toBe(true);
  });

  it("should deny child access if user has parent permission but lacks child permission", () => {
    // User has READ_ACCOUNT_CHARGES so parent allows them in, but they lack READ_ACCOUNT_CATEGORIES for this specific child.
    const result = hasModuleAccess("accounting", ["READ_ACCOUNT_CHARGES"], "accounting-categories");
    expect(result).toBe(false);
  });

  it("should allow child access if user has both parent and child permission", () => {
    // User has READ_ACCOUNT_CHARGES for parent, and READ_ACCOUNT_CATEGORIES for child.
    const result = hasModuleAccess("accounting", ["READ_ACCOUNT_CHARGES", "READ_ACCOUNT_CATEGORIES"], "accounting-categories");
    expect(result).toBe(true);
  });

  it("should deny child access if child route is not found (fail-closed)", () => {
    const result = hasModuleAccess("accounting", ["READ_ACCOUNT_CHARGES"], "non-existent-child");
    expect(result).toBe(false);
  });
});
