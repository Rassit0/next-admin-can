import { Actions, IDiscipline } from "@/modules/disciplines";
import { iconMap } from "@/utils/iconMap";
import { Avatar, Card } from "@heroui/react";
import { HugeiconsIcon } from "@hugeicons/react";

interface Props {
  discipline: IDiscipline;
}

const users = [
  {
    id: 1,
    image:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg",
    name: "John Doe",
  },
  {
    id: 2,
    image:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/green.jpg",
    name: "Kate Wilson",
  },
  {
    id: 3,
    image:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/purple.jpg",
    name: "Emily Chen",
  },
  {
    id: 4,
    image:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/orange.jpg",
    name: "Michael Brown",
  },
  {
    id: 5,
    image:
      "https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/red.jpg",
    name: "Olivia Davis",
  },
];

export const DisciplineCard = ({ discipline }: Props) => {
  return (
    <Card className="min-w-48" variant="default">
      <div className="flex justify-between">
        <HugeiconsIcon icon={iconMap[discipline.icon] ?? iconMap["default"]} />
        <Actions discipline={discipline} />
      </div>

      {/* Header: Icono y Botón de menú */}
      <Card.Header>
        <Card.Title className="text-xl font-bold">{discipline.name}</Card.Title>
      </Card.Header>

      {/* Contenido: Nombre */}
      <Card.Content>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <span className="font-manrope text-2xl font-black text-on-surface">
              342
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-default-500">
              Inscritos
            </span>
          </div>
          {/* Avatar group with counter */}
          {/* <div className="flex -space-x-2">
            {users.slice(0, 3).map((user) => (
              <Avatar key={user.id} size="sm" className="ring-2 ring-background">
                <Avatar.Image alt={user.name} src={user.image} loading="lazy" />
                <Avatar.Fallback>
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </Avatar.Fallback>
              </Avatar>
            ))}
            <Avatar size="sm" className="ring-2 ring-background">
              <Avatar.Fallback className="text-xs">+{users.length - 3}</Avatar.Fallback>
            </Avatar>
          </div> */}
        </div>
      </Card.Content>
    </Card>
  );
};
