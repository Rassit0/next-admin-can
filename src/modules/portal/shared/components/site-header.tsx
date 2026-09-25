"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Crest } from "./crest";
import { cn } from "@/lib/utils";

import {
  navLinks,
  type NavLinkDef,
} from "@/modules/portal/core/constants/navigation";

function DesktopNavItem({
  link,
  pathname,
}: {
  link: NavLinkDef;
  pathname: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubLinks = link.subLinks && link.subLinks.length > 0;

  const isAnyChildActive =
    hasSubLinks && link.subLinks!.some((sl) => pathname.startsWith(sl.href));
  const isActuallyActive = pathname === link.href || isAnyChildActive;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link
        href={link.href}
        data-active={isActuallyActive}
        className={cn(
          "relative px-4 py-2 text-sm font-600 uppercase tracking-wide transition-colors flex items-center gap-1",
          isActuallyActive
            ? "text-primary"
            : "text-muted-foreground hover:text-primary",
        )}
      >
        {link.label}
        {hasSubLinks && (
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        )}
      </Link>

      <AnimatePresence>
        {hasSubLinks && isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 top-full mt-2 w-56 rounded-xl bg-white shadow-xl border border-border/60 overflow-hidden z-50"
          >
            <div className="p-2 flex flex-col gap-1">
              {link.subLinks!.map((sl) => {
                const isChildActive = pathname === sl.href;
                return (
                  <Link
                    key={sl.href}
                    href={sl.href}
                    className={cn(
                      "block rounded-md px-4 py-3 text-sm font-500 transition-colors",
                      isChildActive
                        ? "bg-neon/10 text-neon"
                        : "text-muted-foreground hover:bg-muted hover:text-primary",
                    )}
                  >
                    {sl.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileNavItem({
  link,
  pathname,
  setMobileOpen,
}: {
  link: NavLinkDef;
  pathname: string;
  setMobileOpen: (v: boolean) => void;
}) {
  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
  const isAnyChildActive =
    hasSubLinks && link.subLinks!.some((sl) => pathname.startsWith(sl.href));
  const isActuallyActive = pathname === link.href || isAnyChildActive;
  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  if (!hasSubLinks) {
    return (
      <Link
        href={link.href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "block rounded-md px-4 py-3 text-left text-sm font-600 uppercase tracking-wide transition-colors",
          isActuallyActive
            ? "bg-neon/10 text-neon"
            : "text-primary hover:bg-muted",
        )}
      >
        {link.label}
      </Link>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <Link
          href={link.href}
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex-1 rounded-md px-4 py-3 text-left text-sm font-600 uppercase tracking-wide transition-colors",
            isActuallyActive
              ? "bg-neon/10 text-neon"
              : "text-primary hover:bg-muted",
          )}
        >
          {link.label}
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 text-primary"
          aria-label="Toggle submenu"
        >
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pl-6 pr-2 py-1 flex flex-col gap-1 border-l-2 border-border/50 ml-4 mb-2">
              {link.subLinks!.map((sl) => {
                const isChildActive = pathname === sl.href;
                return (
                  <Link
                    key={sl.href}
                    href={sl.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block rounded-md px-4 py-2 text-sm font-500 transition-colors",
                      isChildActive
                        ? "bg-neon/10 text-neon font-600"
                        : "text-muted-foreground hover:bg-muted hover:text-primary",
                    )}
                  >
                    {sl.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Institution } from "@/modules/portal/institutions/interfaces/institution.interface";

export function SiteHeader({ institution }: { institution: Institution }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  useEffect(() => {
    // Pequeño timeout para asegurar que el DOM se actualizó tras el cambio de ruta
    const timeout = setTimeout(() => {
      if (navRef.current) {
        const activeLink = navRef.current.querySelector<HTMLElement>(
          '[data-active="true"]',
        );
        if (activeLink) {
          const navRect = navRef.current.getBoundingClientRect();
          const linkRect = activeLink.getBoundingClientRect();
          // inset-x-2 significa 8px de margen a cada lado
          setIndicatorStyle({
            left: linkRect.left - navRect.left + 8,
            width: linkRect.width - 16,
            opacity: 1,
          });
        } else {
          setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        }
      }
    }, 50);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" scroll={true}>
          <span className="text-neon drop-shadow-[0_0_10px_var(--neon)]">
            <Crest className="h-9 w-8" strokeWidth={5} />
          </span>
          <span className="flex flex-col items-start leading-none">
            <span className="font-heading text-lg font-700 uppercase tracking-wide text-primary">
              CAN
            </span>
            <span className="text-[10px] font-500 uppercase tracking-[0.25em] text-muted-foreground">
              {institution.name}
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <nav
            ref={navRef}
            className="relative hidden items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => (
              <DesktopNavItem key={link.href} link={link} pathname={pathname} />
            ))}

            <motion.div
              className="absolute -bottom-0.5 h-0.5 rounded-full bg-neon shadow-neon"
              initial={false}
              animate={indicatorStyle}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 28,
              }}
            />
          </nav>

          <Link
            href="/login"
            className="hidden lg:flex items-center justify-center rounded-xl bg-accent px-5 py-2 text-sm font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Ingresar
          </Link>

          <button
            className="rounded-md p-2 text-primary lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border/60 bg-white/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col p-2">
              {navLinks.map((link) => (
                <MobileNavItem
                  key={link.href}
                  link={link}
                  pathname={pathname}
                  setMobileOpen={setMobileOpen}
                />
              ))}
              <div className="mt-4 border-t border-border/50 pt-4 px-4 pb-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl bg-accent px-5 py-3 text-base font-bold uppercase tracking-wide text-white shadow-md active:scale-95 transition-transform"
                >
                  Ingresar
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
