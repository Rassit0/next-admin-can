import Image from "next/image";
import { IPlayer } from "@/modules/players-passes";

interface Props {
  player: IPlayer;
}

export const PlayerContext = ({ player }: Props) => {
  const fullName = [
    player.person.name,
    player.person.lastName,
    player.person.secondLastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-4 mb-8">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-primary-container">
        {player.person.imageUrl ? (
          <Image
            src={player.person.imageUrl}
            alt={fullName}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary-container text-lg font-bold text-on-primary-container">
            {player.person.name.charAt(0)}
            {player.person.lastName.charAt(0)}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Jugador seleccionado
        </p>

        <h4 className="truncate text-lg font-bold text-on-surface">
          {fullName}
        </h4>

        <p className="text-sm text-on-surface-variant">
          {player.person.documentType}: {player.person.documentNumber}
        </p>
      </div>
    </div>
  );
};
