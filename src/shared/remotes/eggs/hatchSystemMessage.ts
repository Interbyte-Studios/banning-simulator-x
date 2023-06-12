import Net from "@rbxts/net";
import { Variants } from "shared/configs/pets";

export const hatchSystemMessageDefinition =
	Net.Definitions.ServerToClientEvent<
		[playerWhoHatched: Player, petId: number, variant: Variants, hatchedOrFused: "hatched" | "fused"]
	>();
export type HatchSystemMessageDefinition = typeof hatchSystemMessageDefinition;
