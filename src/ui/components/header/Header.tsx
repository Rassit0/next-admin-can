"use client";
import Link from "next/link";
import { ThemeButton } from "./ThemeButton";
import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Crest } from "../crest";
import { UserAccountDropdown } from "./UserAccountDropdown";

import { CurrentPerson, AuthIdentity } from "@/shared/helpers/server-context";

const SCROLL_TOP_THRESHOLD = 64;
const SCROLL_DELTA_THRESHOLD = 10;

interface HeaderProps {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  showLogo?: boolean;
  sticky?: boolean;
  hideOnScroll?: boolean;
  user?: AuthIdentity;
  person?: CurrentPerson | null;
}
export const Header = ({
  title,
  actions,
  showLogo,
  sticky = true,
  hideOnScroll = true,
  user,
  person,
}: HeaderProps) => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const lastAnchorY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!hideOnScroll || latest <= SCROLL_TOP_THRESHOLD) {
      lastAnchorY.current = latest;
      setHidden(false);
      return;
    }

    const delta = latest - lastAnchorY.current;
    if (delta > SCROLL_DELTA_THRESHOLD) {
      lastAnchorY.current = latest;
      setHidden(true);
    } else if (delta < -SCROLL_DELTA_THRESHOLD) {
      lastAnchorY.current = latest;
      setHidden(false);
    }
  });
  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hideOnScroll && hidden ? "hidden" : "visible"}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onFocusCapture={() => setHidden(false)}
      className={`w-full h-14 lg:h-16 flex justify-between items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-8 ${
        sticky
          ? "sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border/70"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <Link
          href="/admin"
          aria-label="Ir al inicio de administración"
          className={`flex items-center justify-center rounded-lg p-1 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${showLogo ? "" : "lg:hidden"}`}
        >
          <Crest className="w-8 h-8 md:w-9 md:h-9 object-contain" />
        </Link>
        {title && (
          <span className="hidden sm:block text-lg md:text-xl lg:text-2xl font-semibold text-foreground font-heading leading-tight truncate">
            {title}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {actions && (
          <div className="flex items-center gap-1.5 sm:gap-2">{actions}</div>
        )}
        <ThemeButton />
        <div
          className="h-6 w-px bg-border/80 hidden sm:block"
          aria-hidden="true"
        ></div>
        <UserAccountDropdown user={user} person={person} />
      </div>
    </motion.header>
  );
};
