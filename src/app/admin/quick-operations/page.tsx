import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Operaciones Ri¡pidas | Next Admin CAN",
  description: "Centro de biºsqueda y operaciones de secretari­a",
};

export default function QuickOperationsPage() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-default-500 border-2 border-dashed border-default-200 rounded-xl mt-6">
      <p className="text-lg">
        Busca o selecciona una persona para ver su ficha personal.
      </p>
    </div>
  );
}
