import packageJson from "../../package.json";

/**
 * Metadatos y versión oficial de Gestión360 derivados directamente de package.json
 * como fuente única de verdad.
 */
export const APP_VERSION = packageJson.version;
export const APP_NAME = "Gestión360";
export const APP_DISPLAY_VERSION = `v${packageJson.version}`;
export const APP_AUTHOR = packageJson.author || "Mauricio Ariel Aramayo Vidaurre";
export const APP_SYSTEM_NAME = "Sistema de Gestión CAN";
export const APP_YEAR = new Date().getFullYear().toString();
