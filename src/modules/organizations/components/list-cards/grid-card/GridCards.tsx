import { CardOrganization } from "./Card";
import { IOrganization } from "@/modules/organizations";

interface Props {
  organizations: IOrganization[];
}

export const GridCards = ({ organizations }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {organizations.map((organization) => (
        <CardOrganization key={organization.id} organization={organization} />
      ))}
    </div>
  );
};
