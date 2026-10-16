"use client";

import React, { useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ListBox, Select } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar04Icon } from "@hugeicons/core-free-icons";
import {
  DASHBOARD_PERIOD_OPTIONS,
  DashboardPeriodPreset,
} from "../utils/dashboard-period";

export const DashboardPeriodSelector: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPeriod =
    (searchParams.get("period") as DashboardPeriodPreset) || "this-month";

  const handlePeriodChange = (key: any) => {
    const selected = key?.toString();
    if (!selected) return;

    const params = new URLSearchParams(searchParams.toString());
    if (selected === "this-month") {
      params.delete("period");
    } else {
      params.set("period", selected);
    }
    // Limpiar rangos personalizados al seleccionar un preset estándar
    params.delete("from");
    params.delete("to");

    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center text-slate-400 dark:text-slate-500">
        <HugeiconsIcon icon={Calendar04Icon} size={18} />
      </div>
      <Select
        aria-label="Seleccionar período de análisis"
        variant="secondary"
        className="w-40 md:w-44"
        placeholder="Período"
        value={currentPeriod}
        onChange={handlePeriodChange}
        isDisabled={isPending}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-xl">
          <ListBox items={DASHBOARD_PERIOD_OPTIONS}>
            {(item) => (
              <ListBox.Item
                key={item.id}
                id={item.id}
                textValue={item.label}
                className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg px-3 py-2 cursor-pointer text-xs font-medium"
              >
                {item.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            )}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
};
