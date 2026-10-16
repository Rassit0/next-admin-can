import React from "react";
import { Skeleton } from "@heroui/react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* 1. Header Skeleton */}
      <section className="flex flex-row justify-between items-center gap-4 mb-0 lg:mb-4">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 rounded-xl" />
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </section>

      {/* 2. KPI Cards Grid Skeleton */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-24 rounded-md" />
              <Skeleton className="h-9 w-9 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-36 rounded-lg" />
              <Skeleton className="h-3 w-28 rounded-md" />
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </section>

      {/* 3. Bento Grid - Fila Superior: Flujo Financiero (2 cols) + Alertas (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[40px] p-6 md:p-8 space-y-4 min-h-[380px]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-6 w-48 rounded-lg" />
              <div className="flex gap-4">
                <Skeleton className="h-6 w-20 rounded-md" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[40px] p-6 md:p-8 space-y-4 min-h-[380px]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-lg shrink-0" />
                    <Skeleton className="h-3 w-32 rounded-md" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bento Grid - Fila Media: Cuentas (1 col) + Ocupación (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Cuentas */}
        <div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[40px] p-6 md:p-8 space-y-4 min-h-[360px]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="space-y-3.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-28 rounded-md" />
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ocupación */}
        <div>
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[40px] p-6 md:p-8 space-y-4 min-h-[360px]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-32 rounded-md" />
                    <Skeleton className="h-3 w-14 rounded-md" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Bento Grid - Fila Inferior: Actividad (2 cols) + Deportes (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Actividad Reciente */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[40px] p-6 md:p-8 space-y-4 min-h-[360px]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4 rounded-md" />
                    <Skeleton className="h-2.5 w-1/2 rounded-md" />
                  </div>
                  <Skeleton className="h-2.5 w-10 rounded-md shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Deportes */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl md:rounded-[40px] p-6 md:p-8 space-y-4 min-h-[360px]">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/60">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 rounded-md" />
                    <Skeleton className="h-3 w-20 rounded-md" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
