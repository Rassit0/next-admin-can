import packageJson from "../../package.json";

/**
 * Versión oficial de Gestión360 derivada directamente de package.json
 * como fuente única de verdad.
 */
export const APP_VERSION = packageJson.version;
export const APP_NAME = "Gestión360";
export const APP_DISPLAY_VERSION = `v${packageJson.version}`;

