import { CANApiAdapter } from "./api/CANApi.adapter";
import { auth } from "@/auth";

export const api = new CANApiAdapter(10000, async () => {
  const session = await auth();
  return session?.user?.token;
});
