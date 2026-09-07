"use client";
import React, { useEffect, useState } from "react";
import { Spinner, Card } from "@heroui/react";
import { getSecretarySummary } from "../actions/get-secretary-summary";
import { ISecretarySummaryResponse } from "../interfaces/secretary-summary.interface";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { PersonHeader } from "./person-360/PersonHeader";
import { Person360EnrollStudentDrawer } from "./person-360/Person360EnrollStudentDrawer";
import { Person360EnrollPlayerDrawer } from "./person-360/Person360EnrollPlayerDrawer";
import { TeamMembershipsCard } from "./person-360/TeamMembershipsCard";
import { CourseMembershipsCard } from "./person-360/CourseMembershipsCard";
import { PendingChargesCard } from "./person-360/PendingChargesCard";
import { BulkPaymentDrawer } from "@/modules/charge-transactions/components/drawer/BulkPaymentDrawer";
import { TransactionHistoryDrawer } from "./person-360/TransactionHistoryDrawer";
import { AccountChargeDrawer } from "@/modules/account-charges/components/drawers/AccountChargeDrawer";
import { Button } from "@heroui/react";
import { revalidatePersonSummaryCache } from "../actions/revalidate-summary";
import { PersonContactsCard } from "./person-360/PersonContactsCard";
import { MembershipHistoryDrawer } from "./person-360/MembershipHistoryDrawer";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/ui/animations/transitions";

interface Props {
  personId: string | null;
  selectedPerson: IPersonOption | null;
}

export const Person360Container = ({ personId, selectedPerson }: Props) => {
  const prefersReducedMotion = useReducedMotion();
  const [summary, setSummary] = useState<ISecretarySummaryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bulk Payment State
  const [selectedChargeIds, setSelectedChargeIds] = useState<string[]>([]);
  const [isBulkDrawerOpen, setIsBulkDrawerOpen] = useState(false);

  // Financial Ext State
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isChargeDrawerOpen, setIsChargeDrawerOpen] = useState(false);
  const [isMembershipHistoryDrawerOpen, setIsMembershipHistoryDrawerOpen] = useState(false);

  useEffect(() => {
    if (!personId) {
      setSummary(null);
      setError(null);
      setSelectedChargeIds([]);
      return;
    }

    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getSecretarySummary(personId);
        if (res.error) {
          setError(res.message);
        } else {
          setSummary(res.data || null);
        }
      } catch (err) {
        setError("Ocurrió un error al cargar la información.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [personId]);

  const refreshSummary = async () => {
    if (!personId) return;
    try {
      await revalidatePersonSummaryCache(personId);
      const res = await getSecretarySummary(personId);
      if (!res.error) setSummary(res.data || null);
    } catch (err) {
      // Ignorar errores en refresh
    }
  };

  const handleChargeToggle = (chargeId: string) => {
    setSelectedChargeIds(prev => 
      prev.includes(chargeId) ? prev.filter(id => id !== chargeId) : [...prev, chargeId]
    );
  };

  const handleCobrarClick = () => {
    setIsBulkDrawerOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsBulkDrawerOpen(false);
    setSelectedChargeIds([]);
    refreshSummary();
  };

  if (!personId) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-default-500 border-2 border-dashed border-default-200 rounded-xl mt-6">
        <p className="text-lg">Seleccione una persona para ver sus operaciones rápidas.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-6">
        <Spinner />
        <p className="mt-2 text-default-500">Cargando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-6 text-danger">
        <p>{error}</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <motion.div 
      className="flex flex-col gap-6 mt-6"
      variants={prefersReducedMotion ? {} : staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={prefersReducedMotion ? {} : fadeInUp}>
        <PersonHeader profile={summary.data.profile} selectedPerson={selectedPerson} />
      </motion.div>
      
      <motion.div variants={prefersReducedMotion ? {} : fadeInUp} className="flex flex-wrap items-center gap-4">
        <Person360EnrollPlayerDrawer profile={summary.data.profile} onSuccess={refreshSummary} />
        <Person360EnrollStudentDrawer profile={summary.data.profile} onSuccess={refreshSummary} />
        
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button 
            variant="secondary"
            onPress={() => setIsMembershipHistoryDrawerOpen(true)}
          >
            Historial de Membresías
          </Button>
          <Button 
            variant="secondary"
            onPress={() => setIsHistoryDrawerOpen(true)}
          >
            Historial de Pagos
          </Button>
          <Button 
            variant="outline"
            onPress={() => setIsChargeDrawerOpen(true)}
          >
            <i className="ri-add-line mr-2"></i> Nuevo Cargo
          </Button>
        </div>
      </motion.div>

      <motion.div variants={prefersReducedMotion ? {} : fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TeamMembershipsCard memberships={summary.data.playerMemberships} personId={personId} onSuccess={refreshSummary} />
        <CourseMembershipsCard memberships={summary.data.studentMemberships} personId={personId} onSuccess={refreshSummary} />
        <PendingChargesCard 
          charges={summary.data.pendingCharges} 
          selectedChargeIds={selectedChargeIds}
          onChargeToggle={handleChargeToggle}
          onCobrarClick={handleCobrarClick}
          onSuccess={refreshSummary}
        />
      </motion.div>

      <motion.div variants={prefersReducedMotion ? {} : fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <PersonContactsCard personId={personId} />
      </motion.div>

      <BulkPaymentDrawer 
        isOpen={isBulkDrawerOpen}
        onOpenChange={setIsBulkDrawerOpen}
        charges={summary.data.pendingCharges.filter(c => selectedChargeIds.includes(c.id))}
        payerPerson={selectedPerson}
        onSuccess={handlePaymentSuccess}
        onError={refreshSummary}
      />

      <TransactionHistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onOpenChange={setIsHistoryDrawerOpen}
        person={selectedPerson}
      />

      <MembershipHistoryDrawer
        isOpen={isMembershipHistoryDrawerOpen}
        onOpenChange={setIsMembershipHistoryDrawerOpen}
        person={selectedPerson}
        playerId={summary.data.profile.playerId}
        studentId={summary.data.profile.studentId}
      />

      <AccountChargeDrawer
        isOpen={isChargeDrawerOpen}
        onOpenChange={setIsChargeDrawerOpen}
        direction="RECEIVABLE"
        defaultPerson={selectedPerson}
        onSuccess={() => {
          setIsChargeDrawerOpen(false);
          refreshSummary();
        }}
      />
    </motion.div>
  );
};


