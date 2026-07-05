import { PlayerPassStatus } from "./player-passess.interface";

export interface PostPlayerPassInterface {
  playerId: string;
  previousTeamId?: string;
  externalPreviousTeamName?: string;
  currentTeamId: string;
  originType: string;
  startDate: Date;
  status: PlayerPassStatus;
  notes: string | null;
}
