import { Card } from "@heroui/react";
import React from "react";
import { CardAdd } from "./CardAdd";
import { ITeamSeason } from "@/modules/team-seasons";
import { CardTeamOffering } from "./Card";

interface Props {
  teamSeasons: ITeamSeason[];
}

export const GridCards = ({ teamSeasons }: Props) => {
  if (teamSeasons.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No hay temporadas</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teamSeasons.map((teamSeason) => (
        <CardTeamOffering key={teamSeason.id} teamSeason={teamSeason} />
      ))}
    </div>
  );
};
