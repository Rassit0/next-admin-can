import {
  getChargeOriginConfig,
  isLateFeeCharge,
  shouldShowOriginalAmountStrikethrough,
} from "./charge-origin";

describe("charge-origin helper", () => {
  it("maps MEMBERSHIP to Equipo with blue tokens", () => {
    const config = getChargeOriginConfig("MEMBERSHIP");

    expect(config.origin).toBe("MEMBERSHIP");
    expect(config.label).toBe("Equipo");
    expect(config.iconClass).toBe("ri-group-line");
    expect(config.badgeClass).toContain("blue");
    expect(config.accentBorderClass).toContain("border-l-blue");
  });

  it("maps STUDENT to Curso with violet tokens", () => {
    const config = getChargeOriginConfig("STUDENT");

    expect(config.origin).toBe("STUDENT");
    expect(config.label).toBe("Curso");
    expect(config.iconClass).toBe("ri-book-read-line");
    expect(config.badgeClass).toContain("violet");
    expect(config.accentBorderClass).toContain("border-l-violet");
  });

  it("maps ACCOUNT to Cargo directo with neutral tokens", () => {
    const config = getChargeOriginConfig("ACCOUNT");

    expect(config.origin).toBe("ACCOUNT");
    expect(config.label).toBe("Cargo directo");
    expect(config.iconClass).toBe("ri-file-list-3-line");
    expect(config.badgeClass).toContain("slate");
  });

  it("falls back safely to neutral Cargo config for unknown, null, or empty types", () => {
    for (const input of [undefined, null, "", "UNKNOWN_TYPE", "curso"]) {
      const config = getChargeOriginConfig(input);
      expect(config.origin).toBe("OTHER");
      expect(config.label).toBe("Cargo");
      expect(config.badgeClass).toContain("slate");
    }
  });

  it("detects LATE_FEE exclusively from structured relation items", () => {
    expect(
      isLateFeeCharge({ membershipCharges: [{ type: "LATE_FEE" }] }),
    ).toBe(true);
    expect(
      isLateFeeCharge({ studentCharges: [{ type: "LATE_FEE" }] }),
    ).toBe(true);
    expect(
      isLateFeeCharge({
        membershipCharges: [{ type: "MONTHLY" }],
        studentCharges: [],
      }),
    ).toBe(false);
    expect(isLateFeeCharge({})).toBe(false);
  });

  it("shows strikethrough only when pendingAmount is strictly lower than original amount", () => {
    expect(
      shouldShowOriginalAmountStrikethrough({ amount: 200, pendingAmount: 150 }),
    ).toBe(true);
    expect(
      shouldShowOriginalAmountStrikethrough({ amount: 200, pendingAmount: 0 }),
    ).toBe(true);
    expect(
      shouldShowOriginalAmountStrikethrough({ amount: 200, pendingAmount: 200 }),
    ).toBe(false);
    expect(
      shouldShowOriginalAmountStrikethrough({ amount: 200, pendingAmount: 220 }),
    ).toBe(false);
    expect(
      shouldShowOriginalAmountStrikethrough({ amount: 0, pendingAmount: 0 }),
    ).toBe(false);
  });
});

