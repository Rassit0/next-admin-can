import packageJson from "../../package.json";
import { APP_VERSION, APP_NAME, APP_DISPLAY_VERSION } from "./version";

describe("Version configuration", () => {
  it("derives APP_VERSION directly from package.json", () => {
    expect(APP_VERSION).toBe(packageJson.version);
    expect(APP_VERSION).toBe("1.0.0");
  });

  it("formats display version properly", () => {
    expect(APP_DISPLAY_VERSION).toBe("v1.0.0");
    expect(APP_NAME).toBe("Gestión360");
  });
});

