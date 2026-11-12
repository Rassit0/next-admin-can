"use client";

import clsx from "clsx";
import Link from "next/link";
import { Button, Tooltip } from "@heroui/react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { IOrganization } from "@/modules/organizations";
import { Crest } from "../crest";

interface Props {
  organization: Partial<IOrganization>;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const Header = ({
  organization,
  isCollapsed,
  onToggleCollapse,
}: Props) => {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 transition-all duration-200",
        isCollapsed ? "flex-col px-2" : "flex-row justify-between px-4",
      )}
    >
      <Link
        aria-label={
          isCollapsed
            ? `${organization.name || "Inicio"} — Panel Administrativo`
            : undefined
        }
        className={clsx(
          "flex items-center gap-3 rounded-xl py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus min-w-0",
          isCollapsed ? "justify-center px-1" : "flex-1 pr-1",
        )}
        href="/admin"
      >
        <span className="shrink-0 text-neon drop-shadow-[0_0_10px_var(--accent)]">
          <Crest className={isCollapsed ? "h-10 w-8" : "h-11 w-9"} />
        </span>

        {!isCollapsed && (
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold tracking-tight text-sky-700 dark:text-sky-400 font-heading leading-tight">
              {organization.name}
            </h1>
            <p className="text-[10px] font-semibold text-foreground/65 uppercase tracking-wider">
              Administración
            </p>
          </div>
        )}
      </Link>

      <Tooltip closeDelay={0} delay={150}>
        <Button
          isIconOnly
          aria-expanded={!isCollapsed}
          aria-label={
            isCollapsed ? "Expandir barra lateral" : "Colapsar barra lateral"
          }
          className="h-8 w-8 min-w-8 shrink-0 rounded-lg text-foreground/65 hover:text-foreground hover:bg-surface-secondary"
          size="sm"
          variant="ghost"
          onPress={onToggleCollapse}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
        <Tooltip.Content showArrow placement="right">
          <Tooltip.Arrow />
          <span className="text-xs font-medium">
            {isCollapsed ? "Expandir menú" : "Colapsar menú"}
          </span>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
};
