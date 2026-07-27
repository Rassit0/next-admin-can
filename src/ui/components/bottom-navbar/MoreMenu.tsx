"use client";
import { NavItem } from "@/ui/interfaces/sidebar/sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { MobileNavItem } from "./MobileNavItem";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  urlBase?: string;
  isItemActive: (item: NavItem) => boolean;
}

export const MoreMenu = ({ isOpen, onClose, items, urlBase, isItemActive }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed bottom-[70px] left-2 right-2 z-50 bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-100 dark:border-slate-800"
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="grid grid-cols-3 gap-3"
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
                  }}
                  className="w-full flex justify-center"
                >
                  <MobileNavItem
                    item={item}
                    urlBase={urlBase}
                    isActive={isItemActive(item)}
                    onClick={onClose}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
