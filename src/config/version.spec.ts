import packageJson from "../../package.json";
import {
  APP_VERSION,
  APP_NAME,
  APP_DISPLAY_VERSION,
  APP_AUTHOR,
  APP_SYSTEM_NAME,
  APP_YEAR,
} from "./version";

describe("Version configuration", () => {
  it("derives APP_VERSION directly from package.json", () => {
    expect(APP_VERSION).toBe(packageJson.version);
    expect(APP_VERSION).toBe("1.0.0");
  });

  it("derives APP_AUTHOR directly from package.json", () => {
    expect(APP_AUTHOR).toBe(packageJson.author);
    expect(APP_AUTHOR).toBe("Mauricio Ariel Aramayo Vidaurre");
  });

  it("formats display version properly", () => {
    expect(APP_DISPLAY_VERSION).toBe("v1.0.0");
    expect(APP_NAME).toBe("Gestión360");
    expect(APP_SYSTEM_NAME).toBe("Sistema de Gestión CAN");
    expect(APP_YEAR).toBe(new Date().getFullYear().toString());
  });
});
