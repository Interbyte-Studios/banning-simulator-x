import { Janitor } from "@rbxts/janitor";
import { TimeTrialDifficulty } from "shared/configs/timeTrials";

export enum TimeTrialStatus {
	WaitingForStart,
	Ongoing,
}

export const currentTimeTrials: Map<
	Player,
	{
		cleanupHandler: Janitor;
		wave: number;
		difficulty: TimeTrialDifficulty;
		status: TimeTrialStatus;
		/**
		 * The amount of time the player has left to complete the time trial,
		 * in seconds.
		 */
		timeRemaining: number;
		selectedNPC: string;
		npcs: Array<{ instance: Model; lastAttack: number; attackAnim: AnimationTrack }>;
		npcFolder: Folder;
		npcSpawns: Folder;
	}
> = new Map();
