"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { useSidebarCollapsed } from "./useSidebarPrefs";

interface Props {
  children: ReactNode;
}

export const SidebarContentArea = ({ children }: Props) => {
  const { isCollapsed } = useSidebarCollapsed();

  return (
    <div
      className={clsx(
        "min-h-screen transition-[margin] duration-300 motion-reduce:transition-none pb-20 lg:pb-2",
        isCollapsed ? "lg:ml-20" : "lg:ml-64",
      )}
    >
      {children}
    </div>
  );
};

