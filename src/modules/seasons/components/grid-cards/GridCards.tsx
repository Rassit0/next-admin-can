import { Card } from "@heroui/react";
import React from "react";
import { FormSeason } from "../form/Form";
import { CardAdd } from "./CardAdd";

export const GridCards = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <CardAdd />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-headline-sm font-bold text-on-surface">
          Historial de Ciclos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 flex justify-between items-start">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-tertiary-container text-on-tertiary-container mb-3 uppercase tracking-wider">
                Activa
              </span>
              <h4 className="text-lg font-bold text-on-surface">
                Temporada 2024-2025
              </h4>
              <p className="text-sm text-on-surface-variant mt-1">
                01 Sep 2024 - 30 Jun 2025
              </p>
            </div>
            <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">
                more_vert
              </span>
            </button>
          </Card>
          <Card className="bg-surface-container-low/50 rounded-2xl p-6 border border-transparent opacity-70">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-surface-container-highest text-on-surface-variant mb-3 uppercase tracking-wider">
                Histórica
              </span>
              <h4 className="text-lg font-bold text-on-surface">
                Temporada 2023-2024
              </h4>
              <p className="text-sm text-on-surface-variant mt-1">
                01 Sep 2023 - 30 Jun 2024
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
