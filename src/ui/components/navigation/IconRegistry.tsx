"use client";

import React from "react";
import {
  ArrowDataTransferHorizontalIcon,
  BookOpen01Icon,
  Building03FreeIcons,
  Building03Icon,
  Calendar03Icon,
  Calendar04Icon,
  CheckmarkSquare03Icon,
  DashboardSquare02Icon,
  DashboardCircleEditIcon,
  GlobalIcon,
  DistributeVerticalBottomIcon,
  Flag03Icon,
  IdentityCardIcon,
  Layers01Icon,
  Mortarboard02Icon,
  Structure04FreeIcons,
  Structure04Icon,
  StudentIcon,
  TaskDone01Icon,
  UserGroupIcon,
  UserIcon,
  UserMultipleIcon,
  Time02Icon,
  Invoice01Icon,
  FlashIcon,
  Calendar01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export type NavigationIconKey = 
  | "quick-operations"
  | "dashboard"
  | "disciplines"
  | "locations"
  | "categories"
  | "seasons"
  | "clubs"
  | "teams"
  | "players"
  | "memberships"
  | "schools"
  | "courses"
  | "students"
  | "accounting"
  | "shifts"
  | "users"
  | "web"
  | "calendar"
  | "news"
  | "attendance";

export const getNavigationIcon = (key?: NavigationIconKey, size: number = 20): React.ReactNode => {
  if (!key) return null;

  switch (key) {
    case "quick-operations":
      return <HugeiconsIcon icon={FlashIcon} size={size} />;
    case "dashboard":
      return <HugeiconsIcon icon={DashboardSquare02Icon} size={size} />;
    case "disciplines":
      return <HugeiconsIcon icon={Structure04FreeIcons} size={size} />;
    case "locations":
      return <HugeiconsIcon icon={Building03Icon} size={size} />;
    case "categories":
      return <HugeiconsIcon icon={Layers01Icon} size={size} />;
    case "seasons":
      return <HugeiconsIcon icon={Calendar04Icon} size={size} />;
    case "clubs":
      return <HugeiconsIcon icon={Flag03Icon} size={size} />;
    case "teams":
      return <HugeiconsIcon icon={UserGroupIcon} size={size} />;
    case "players":
      return <HugeiconsIcon icon={UserMultipleIcon} size={size} />;
    case "memberships":
      return <HugeiconsIcon icon={IdentityCardIcon} size={size} />;
    case "schools":
      return <HugeiconsIcon icon={Mortarboard02Icon} size={size} />;
    case "courses":
      return <HugeiconsIcon icon={BookOpen01Icon} size={size} />;
    case "students":
      return <HugeiconsIcon icon={StudentIcon} size={size} />;
    case "accounting":
      return <HugeiconsIcon icon={Invoice01Icon} size={size} />;
    case "shifts":
      return <HugeiconsIcon icon={Time02Icon} size={size} />;
    case "users":
      return <HugeiconsIcon icon={UserIcon} size={size} />;
    case "web":
      return <HugeiconsIcon icon={GlobalIcon} size={size} />;
    case "calendar":
      return <HugeiconsIcon icon={Calendar01Icon} size={size} />;
    case "news":
      return <HugeiconsIcon icon={BookOpen01Icon} size={size} />;
    case "attendance":
      return <HugeiconsIcon icon={TaskDone01Icon} size={size} />;
    default:
      return null;
  }
};

export const NavigationIcon = ({ iconKey, size = 20 }: { iconKey?: NavigationIconKey; size?: number }) => {
  return <>{getNavigationIcon(iconKey, size)}</>;
};
