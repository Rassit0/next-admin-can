"use client";
import React from "react";
import { Card, Avatar } from "@heroui/react";
import { IPersonProfileSummary } from "../../interfaces/secretary-summary.interface";
import { IPersonOption } from "@/common/actions/get-persons-options";
import { usePermissions } from "@/shared/providers/PermissionsProvider";
import { Person360EditAction } from "./Person360EditAction";
import { PersonHeroParticles } from "./PersonHeroParticles";

interface Props {
  profile: IPersonProfileSummary;
  selectedPerson: IPersonOption | null;
}

export const PersonHeader = ({ profile, selectedPerson }: Props) => {
  const permissions = usePermissions();
  const canEditPerson = permissions.includes("UPDATE_PERSONS");

  return (
    <Card className="relative overflow-hidden border border-default-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-linear-to-r from-default-50 to-background">
      <PersonHeroParticles />

      <Card.Content className="relative z-10 p-5 flex flex-row items-center gap-5">
        <Avatar
          size="lg"
          className="w-16 h-16 text-large border-2 border-background shadow-sm"
        >
          <Avatar.Image src={profile.imageUrl || undefined} />
          <Avatar.Fallback>
            {profile.name.charAt(0) + (profile.lastName?.charAt(0) || "")}
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">
            {selectedPerson?.fullName ||
              `${profile.lastName || ""} ${profile.secondLastName || ""} ${profile.name}`
                .replace(/\s+/g, " ")
                .trim()}
          </h2>
          <div className="flex gap-4 mt-1 text-sm text-default-500">
            {profile.documentNumber && (
              <span className="flex items-center gap-1">
                <i className="ri-id-card-line"></i> {profile.documentNumber}
              </span>
            )}
            {profile.phone && (
              <span className="flex items-center gap-1">
                <i className="ri-phone-line"></i> {profile.phone}
              </span>
            )}
            {profile.email && (
              <span className="flex items-center gap-1">
                <i className="ri-mail-line"></i> {profile.email}
              </span>
            )}
          </div>
        </div>

        {canEditPerson && (
          <div className="ml-auto">
            <Person360EditAction personId={profile.id} />
          </div>
        )}
      </Card.Content>
    </Card>
  );
};
