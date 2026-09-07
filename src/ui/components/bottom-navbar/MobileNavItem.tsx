"use client";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import clsx from "clsx";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  item: NavItem;
  urlBase?: string;
  isActive: boolean;
  onClick?: () => void;
}

const springTransition = { type: "spring" as const, stiffness: 380, damping: 28 };

export const MobileNavItem = ({ item, urlBase, isActive, onClick }: Props) => {
  return (
    <Link href={urlBase ? `${urlBase}/${item.href}` : item.href} onClick={onClick} className="w-full h-full flex justify-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.9 }}
        className={clsx(
          "relative flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 w-full h-full cursor-pointer",
          item.highlight && !isActive && "bg-indigo-50/60 dark:bg-indigo-900/20"
        )}
      >
        {isActive && (
          <motion.div
            layoutId="mobile-active-pill"
            className={clsx(
              "absolute inset-0 rounded-2xl",
              item.highlight
                ? "bg-indigo-500/15 dark:bg-indigo-500/30 shadow-[inset_0_0_12px_rgba(99,102,241,0.15)]"
                : "bg-sky-500/10 dark:bg-sky-500/20 shadow-[inset_0_0_12px_rgba(14,165,233,0.1)]"
            )}
            initial={false}
            transition={springTransition}
          />
        )}
        
        <div
          className={clsx(
            "relative z-10 flex flex-col items-center justify-center transition-colors duration-300 w-full",
            item.highlight
              ? isActive
                ? "text-indigo-700 dark:text-indigo-300"
                : "text-indigo-600/90 dark:text-indigo-400/80 hover:text-indigo-700 dark:hover:text-indigo-300"
              : isActive
                ? "text-sky-600 dark:text-sky-400"
                : "text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-300"
          )}
        >
          <div className="scale-[0.85] origin-bottom">
            {item.icon}
          </div>
          {item.label && (
            <span className="font-inter text-[8px] sm:text-[9px] font-bold tracking-tighter uppercase mt-1 text-center w-full truncate px-0.5">
              {item.label}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
};
