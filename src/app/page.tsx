import {
  Footer,
  HeaderPageLouncher,
  ModuleGrid,
} from "@/modules/module-louncher";
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("admin");
}
