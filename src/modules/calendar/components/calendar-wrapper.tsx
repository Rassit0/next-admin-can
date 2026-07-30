"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@heroui/react";

// Deshabilita SSR para evitar problemas de rehidratación o conflictos
// con los constructores de clases internas de FullCalendar en Next.js (ej. DayTableView)
export const CalendarWrapper = dynamic(
  () => import("./calendar-view").then((mod) => mod.CalendarView),
  {
    ssr: false,
    loading: () => (
      <Skeleton className="w-full h-[600px] rounded-xl" />
    ),
  }
);
