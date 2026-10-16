import React from "react";
import { Skeleton } from "@heroui/react";

export default function TeacherGroupWorkspaceLoading() {
  return (
    <div className="space-y-6">
      {/* 1. Header Skeleton */}
      <div className="space-y-4 pb-4 border-b border-divider/60">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-xl" />
        </div>

        {/* Group Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-5 w-28 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-8 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-md" />
          </div>

          <Skeleton className="h-16 w-56 rounded-2xl" />
        </div>
      </div>

      {/* 2. Tabs Skeleton */}
      <div className="flex items-center gap-2 border-b border-divider/60 pb-2">
        <Skeleton className="h-8 w-24 rounded-xl" />
        <Skeleton className="h-8 w-32 rounded-xl" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>

      {/* 3. Content Overview Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 border border-divider rounded-2xl bg-content1 space-y-3"
          >
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="h-3 w-3/4 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
