import React from "react";
import { Metadata } from "next";
import { OfflineHero, OfflineReconnect } from "@/modules/offline";

export const metadata: Metadata = {
  title: "Conexión en pausa | Sistema Gestión CAN",
  description:
    "Te encuentras fuera de línea. La aplicación se reconectará automáticamente.",
};

export default function OfflinePage() {
  return (
    <main className="relative min-h-dvh w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1120] overflow-hidden selection:bg-sky-200 selection:text-sky-900">
      {/* Fondo Premium (Mesh Gradient suave y sutil) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        {/* Glow Superior Izquierdo */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-sky-200/30 dark:bg-sky-900/15 blur-[100px]" />

        {/* Glow Inferior Derecho */}
        <div className="absolute top-[60%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/15 blur-[100px]" />
      </div>

      <OfflineHero />
      <OfflineReconnect />
    </main>
  );
}
