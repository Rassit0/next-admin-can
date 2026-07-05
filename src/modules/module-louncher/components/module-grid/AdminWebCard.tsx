import { Card } from "@heroui/react";
import React from "react";

export const AdminWebCard = () => {
  return (
    <Card
      className="
        group
        p-8
        shadow-sm
        flex
        flex-col
        h-full
        transition-all
        duration-300
        hover:-translate-y-2
        hover:shadow-xl
        hover:shadow-black/5
      "
    >
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          web
        </span>
      </div>
      <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
        Administración Web
      </h3>
      <p className="text-sm text-gray-500 font-body leading-relaxed mb-6">
        Mantenimiento de portales oficiales y contenido digital para socios.
      </p>
      <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          CMS y Portales
        </span>
        <span className="material-symbols-outlined text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
          east
        </span>
      </div>
    </Card>
  );
};
