"use client";

import clsx from "clsx";
import { ReactNode } from "react";
import { useSidebarCollapsed } from "./useSidebarPrefs";
import { GlobalFooter } from "../footer/GlobalFooter";

interface Props {
  children: ReactNode;
}

export const SidebarContentArea = ({ children }: Props) => {
  const { isCollapsed } = useSidebarCollapsed();

  return (
    <div
      className={clsx(
        "min-h-screen flex flex-col transition-[margin] duration-300 motion-reduce:transition-none pb-20 lg:pb-0",
        isCollapsed ? "lg:ml-20" : "lg:ml-64",
      )}
    >
      <div className="flex-1 w-full flex flex-col">{children}</div>
      <GlobalFooter />
    </div>
  );
};

