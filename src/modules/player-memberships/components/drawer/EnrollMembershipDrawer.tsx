"use client";
import { Button, Drawer } from "@heroui/react";
import { ITeamSeason } from "@/modules/team-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { EnrollMembershipForm } from "../form/EnrollMembershipForm";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface Props {
  teamSeason: ITeamSeason;
  paymentPlans: IPaymentPlan[];
  size?: "lg" | "md" | "sm";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
  defaultPerson?: IPersonOption;
  onSuccess?: () => void;
}

export const EnrollMembershipDrawer = ({
  teamSeason,
  paymentPlans,
  size = "md",
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
  defaultPerson,
  onSuccess,
}: Props) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

  return (
    <>
      {trigger !== undefined ? (
        trigger ? <div onClick={() => setIsOpen(true)}>{trigger}</div> : null
      ) : (
        <Button onPress={() => setIsOpen(true)}>
          <HugeiconsIcon icon={Add01Icon} size={18} />
          Inscribir
        </Button>
      )}

      <Drawer.Backdrop isOpen={isOpen} onOpenChange={setIsOpen} isDismissable={false}>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="w-full sm:max-w-md">
            <Drawer.CloseTrigger />
            <Drawer.Header className="border-b border-border">
                <div>
                  <Drawer.Heading slot="title" className="text-lg font-bold">
                    Inscribir atleta
                  </Drawer.Heading>
                  <p className="mt-1 text-xs font-medium text-muted">
                    {teamSeason.team.name} — {teamSeason.season.name}
                  </p>
                </div>
              </Drawer.Header>

              <EnrollMembershipForm
                teamSeason={teamSeason}
                paymentPlans={paymentPlans}
                defaultPerson={defaultPerson}
                onSuccess={() => {
                  onSuccess?.();
                  setIsOpen(false);
                }}
                onCancel={() => setIsOpen(false)}
              />
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
};
