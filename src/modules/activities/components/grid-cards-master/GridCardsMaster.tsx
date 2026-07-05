import { IActivity } from "@/modules/activities";
import { CardTeam } from "./CardTeam";
import { CardEducational } from "./CardEducational";

interface Props {
  activities: IActivity[];
}
export const GridCardsMaster = ({ activities }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {activities.map((activity) => (
        <div key={activity.id}>
          {activity.type === "TEAM" ? (
            <CardTeam activity={activity} />
          ) : (
            <CardEducational activity={activity} />
          )}
        </div>
      ))}
    </div>
  );
};
