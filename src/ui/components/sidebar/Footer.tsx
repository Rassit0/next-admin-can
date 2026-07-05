import {
  Add01Icon,
  Logout01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

export const Footer = () => {
  return (
    <div className="px-3 lg:px-4 mt-auto space-y-1">
      {/* <button className="w-full mb-4 py-3 px-2 lg:px-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-accent-soft-hover">
        <HugeiconsIcon icon={Add01Icon} />
        <span className="text-sm hidden lg:block">Nuevo</span>
      </button> */}
      <a
        className="flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-200/50 dark:hover:bg-slate-800"
        href="#"
      >
        <HugeiconsIcon icon={Settings02Icon} />
        <span className="text-sm font-semibold hidden lg:block nav-text">
          Configuración
        </span>
      </a>
      <a
        className="flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-colors duration-200 text-slate-500 dark:text-slate-400 hover:text-sky-600 hover:bg-slate-200/50 dark:hover:bg-slate-800"
        href="#"
      >
        <HugeiconsIcon icon={Logout01Icon} />
        <span className="text-sm font-semibold hidden lg:block nav-text">
          Cerrar Sesión
        </span>
      </a>
    </div>
  );
};
