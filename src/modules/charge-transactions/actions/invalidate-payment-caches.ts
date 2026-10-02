"use server";

import { updateTag } from "next/cache";

export const invalidatePaymentCaches = async (personId?: string, chargeId?: string) => {
  updateTag("transactions");
  updateTag("charges");
  updateTag("account-charges");
  updateTag("student-memberships");
  updateTag("course-seasons");
  updateTag("student-charges");

  if (personId) {
    updateTag(`person-${personId}-summary`);
  }

  if (chargeId) {
    updateTag(`charge-${chargeId}`);
  }
};
