import { ITeam } from "@/modules/teams";
import { CardTeam } from "./Card";

interface Props {
  teams: ITeam[];
}

export const GridCards = ({ teams }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {teams.map((team) => (
        <CardTeam key={team.id} team={team} />
      ))}
    </div>
  );
};
