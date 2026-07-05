import { Button, Card } from "@heroui/react";
import {
  ArrowRight,
  ArrowRight02Icon,
  Mortarboard02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React from "react";

export const SchoolsCard = () => {
  return (
    <Link href="/schools">
      <Card className="group p-8 shadow-sm flex flex-col h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/5">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
          <HugeiconsIcon
            icon={Mortarboard02Icon}
            style={{ fontVariationSettings: "'FILL' 1" }}
          />
        </div>

        <h3 className="text-xl font-headline font-bold text-on-surface mb-2">
          Escuelas
        </h3>

        <p className="text-sm text-gray-500 font-body leading-relaxed mb-6">
          Gestión de academias, programas formativos y monitoreo de progreso
          deportivo.
        </p>

        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between">
          <span className="text-xs font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-wider">
            452 Inscritos
          </span>

          <HugeiconsIcon
            icon={ArrowRight02Icon}
            className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all"
            size={40}
          />
        </div>
      </Card>
    </Link>
  );
};
