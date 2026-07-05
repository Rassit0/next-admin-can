"use client";

import { Card, Button } from "@heroui/react";
import { motion } from "framer-motion";

import { useState } from "react";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import {
  IMember,
  IMemberTeamSeasonAssignment,
} from "@/modules/membresias/types";
import { AssignmentTable } from "./AssignmentTable";
import { AssignmentModal } from "./AssignmentModal";

interface DashboardProps {
  teamSeason: ITeamSeason;
  assignments: IMemberTeamSeasonAssignment[];
  members: IMember[];
  paymentPlans: IPaymentPlan[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

const MetricCard = ({ label, value, icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <Card className="p-5 shadow-sm border border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={`flex size-12 items-center justify-center rounded-lg bg-${color}/10 shadow-sm text-${color}`}
        >
          •
        </div>
      </div>
    </Card>
  </motion.div>
);

export const Dashboard = ({
  teamSeason,
  assignments,
  members,
  paymentPlans,
  onRefresh,
  isLoading,
}: DashboardProps) => {
  const [refreshing, setRefreshing] = useState(false);

  const activeCount = assignments.filter((a) => a.status === "active").length;
  const suspendedCount = assignments.filter(
    (a) => a.status === "suspended",
  ).length;
  const totalRevenue = assignments
    .filter((a) => a.status === "active" || a.status === "completed")
    .reduce((sum, a) => sum + a.totalInitialCharges, 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh?.();
    setRefreshing(false);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-foreground">
              Gestión de Miembros
            </h2>
            <p className="mt-1 text-sm text-muted">
              {teamSeason.team?.name} · {teamSeason.season?.name}
            </p>
          </div>
          <Button
            className="bg-accent text-accent-foreground font-semibold"
            size="lg"
            isDisabled={isLoading}
          >
            Asignar Miembro
          </Button>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          <MetricCard
            label="Total de Miembros"
            value={assignments.length}
            color="primary"
          />
          <MetricCard
            label="Miembros Activos"
            value={activeCount}
            color="success"
          />
          <MetricCard
            label="Suspendidos"
            value={suspendedCount}
            color="warning"
          />
          <MetricCard
            label="Miembros Activos"
            value={activeCount}
            color="success"
          />
          <MetricCard
            label="Suspendidos"
            value={suspendedCount}
            color="warning"
          />
        </motion.div>

        <motion.div
          className="rounded-xl border border-border bg-surface-secondary/40 p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">
                Ingresos Proyectados
              </h3>
              <p className="mt-1 text-sm text-muted">
                Estimado de cargos iniciales realizados
              </p>
            </div>
            <Button
              isIconOnly
              variant="ghost"
              size="sm"
              isPending={refreshing}
              onPress={handleRefresh}
            >
              ⟳
            </Button>
          </div>
          <p className="text-3xl font-extrabold text-accent">
            {new Intl.NumberFormat("es-BO", {
              style: "currency",
              currency: "BOB",
            }).format(totalRevenue)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6 shadow-sm border border-border">
            <AssignmentTable
              assignments={assignments}
              isLoading={isLoading}
              onStatusChange={handleRefresh}
            />
          </Card>
        </motion.div>
      </div>

      <AssignmentModal
        teamSeasonId={teamSeason.id}
        onAssignmentSuccess={handleRefresh}
      />
    </>
  );
};
