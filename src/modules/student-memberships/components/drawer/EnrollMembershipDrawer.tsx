"use client";
import { Button, Drawer } from "@heroui/react";
import { ICourseSeason } from "@/modules/course-seasons";
import { IPaymentPlan } from "@/modules/payment-plans";
import { IStudentOption } from "@/modules/student-memberships";
import { EnrollMembershipForm } from "../form/EnrollMembershipForm";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon } from "@hugeicons/core-free-icons";

interface Props {
  courseSeason: ICourseSeason;
  paymentPlans: IPaymentPlan[];
  size?: "lg" | "md" | "sm";
  defaultShiftId?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode | null;
  defaultStudent?: IStudentOption;
  onSuccess?: () => void;
}

export const EnrollMembershipDrawer = ({
  courseSeason,
  paymentPlans,
  size = "md",
  defaultShiftId,
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
  trigger,
  defaultStudent,
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
                  <Drawer.Heading className="text-lg font-bold">
                    Inscribir estudiante
                  </Drawer.Heading>
                  <p className="mt-1 text-xs font-medium text-muted">
                    {courseSeason.course.name} — {courseSeason.season.name}
                  </p>
                </div>
              </Drawer.Header>

              <EnrollMembershipForm
                courseSeason={courseSeason}
                paymentPlans={paymentPlans}
                defaultShiftId={defaultShiftId}
                defaultStudent={defaultStudent}
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
