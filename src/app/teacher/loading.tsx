import React from "react";
import { Skeleton } from "@heroui/react";

export default function TeacherLoading() {
  return (
    <div className="space-y-6">
      {/* 1. Header / Saludo Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-80 rounded-lg" />
      </div>

      {/* 2. KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border border-divider rounded-2xl bg-content1 space-y-3"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-28 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-36 rounded-md" />
          </div>
        ))}
      </div>

      {/* 3. Main Content Skeleton (Mis Grupos + Próxima Sesión) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Grupos (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-36 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 border border-divider rounded-2xl bg-content1 space-y-3"
              >
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <div className="pt-3 border-t border-divider/60 space-y-2">
                  <Skeleton className="h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-4/5 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas Sesiones (1 col on lg) */}
        <div className="lg:col-span-1 space-y-4">
          <Skeleton className="h-6 w-40 rounded-lg" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 border border-divider rounded-2xl bg-content1 space-y-2.5"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
                <Skeleton className="h-5 w-44 rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
