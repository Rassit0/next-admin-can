"use server";

import { signOut } from "@/auth";

export async function logoutAction(callbackUrl?: string | FormData | any) {
  console.log("Logout");
  const url =
    typeof callbackUrl === "string" && callbackUrl.trim() !== ""
      ? `/login?redirectTo=${encodeURIComponent(callbackUrl)}`
      : "/login";
  await signOut({ redirectTo: url });
}
