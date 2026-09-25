import React from "react";
import { getDetailedProfile } from "@/modules/users/actions/get-detailed-profile";
import { Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Mail01Icon,
  SmartPhone01Icon,
  IdentificationIcon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { HeaderPage } from "@/ui";
import { redirect } from "next/navigation";
import { AvatarEditor } from "./AvatarEditor";
import { updateSelfAvatar } from "@/modules/users/actions/update-self-avatar";
import { SelfProfileContent } from "./SelfProfileContent";
export default async function ProfilePage() {
  const profileResponse = await getDetailedProfile();

  if (profileResponse.error) {
    if (profileResponse.statusCode === 401) {
      redirect("/login?expired=true");
    }
    return (
      <div className="p-6">
        <p className="text-danger">Error al cargar el perfil detallado.</p>
      </div>
    );
  }

  const profile = profileResponse.data;
  if (!profile) return null;

  const { user, person } = profile;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6 p-6">
      <HeaderPage
        title="Mi Perfil"
        description="Informacón personal de tu cuenta."
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Mi Perfil" },
        ]}
      />

      <SelfProfileContent profile={profile} />
    </div>
  );
}
