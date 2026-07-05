"use client";

import { motion, Variants } from "framer-motion";
import { IMemberTeamSeasonAssignment } from "@/modules/membresias/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Invoice01Icon, Tick01Icon } from "@hugeicons/core-free-icons";

interface InvoicePreviewProps {
  assignment: IMemberTeamSeasonAssignment;
  isLoading?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

const formatCurrency = (amount: number, currency: string = "BOB") =>
  new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency,
  }).format(amount);

export const InvoicePreview = ({ assignment, isLoading }: InvoicePreviewProps) => {
  return (
    <motion.div
      className="rounded-xl border border-border bg-surface-secondary p-6 shadow-sm"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <HugeiconsIcon icon={Invoice01Icon} size={18} />
        </motion.div>
        <motion.span variants={itemVariants}>Resumen de Cargos Iniciales</motion.span>
      </motion.div>

      <motion.div
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex items-center justify-between rounded-lg bg-surface p-3"
          variants={itemVariants}
        >
          <span className="text-xs text-muted">Cuota de Inscripción</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(assignment.registrationFeeAmount)}
          </span>
        </motion.div>

        <motion.div
          className="flex items-center justify-between rounded-lg bg-surface p-3"
          variants={itemVariants}
        >
          <span className="text-xs text-muted">Cuota Mensual (1er mes)</span>
          <span className="font-semibold text-foreground">
            {formatCurrency(assignment.monthlyFeeAmount)}
          </span>
        </motion.div>

        <motion.div
          className="border-t border-border pt-3"
          variants={itemVariants}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground">Total Inicial</span>
            <span className="text-lg font-extrabold text-accent">
              {formatCurrency(assignment.totalInitialCharges)}
            </span>
          </div>
        </motion.div>

        {isLoading && (
          <motion.div
            className="flex items-center gap-2 rounded-lg bg-accent/10 p-3 text-xs text-accent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <HugeiconsIcon icon={Tick01Icon} size={16} />
            <span>Procesando inscripción...</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};
