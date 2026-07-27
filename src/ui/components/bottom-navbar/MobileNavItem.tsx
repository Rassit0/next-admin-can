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
        className="relative flex flex-col items-center justify-center rounded-2xl px-1 py-1.5 w-full h-full cursor-pointer"
      >
        {isActive && (
          <motion.div
            layoutId="mobile-active-pill"
            className="absolute inset-0 bg-sky-500/10 dark:bg-sky-500/20 shadow-[inset_0_0_12px_rgba(14,165,233,0.1)] rounded-2xl"
            initial={false}
            transition={springTransition}
          />
        )}
        
        <div
          className={clsx(
            "relative z-10 flex flex-col items-center justify-center transition-colors duration-300 w-full",
            isActive
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
