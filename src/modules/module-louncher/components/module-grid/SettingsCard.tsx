import { Card } from "@heroui/react";
import { Setting07Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React from "react";

export const SettingsCard = () => {
  return (
    <Link href="/settings">
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
        <div className="w-14 h-14 bg-default rounded-2xl flex items-center justify-center text-accent mb-6 transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-foreground">
          <HugeiconsIcon
            icon={Setting07Icon}
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        </div>
        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
          Configuraciones
        </h3>
        <p className="text-sm text-gray-500 font-body leading-relaxed mb-6">
          Parámetros globales del sistema, seguridad y gestión de roles.
        </p>
        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Ajustes del Sistema
          </span>
          <span className="material-symbols-outlined text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
            east
          </span>
        </div>
      </Card>
    </Link>
  );
};
