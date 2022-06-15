import Net from "@rbxts/net";
import { EggNames } from "shared/configs/eggs";
import { Variants } from "shared/configs/pets";

export interface ConfirmedPet {
	id: number;
	variant: Variants;
	autoDeleted: boolean;
}

export const relayHatchDefinition =
	Net.Definitions.ServerToClientEvent<
		[amount: 1 | 2 | 3, eggName: EggNames, pets: Array<ConfirmedPet>, isVoid: boolean]
	>();
export type RelayHatchDefinition = typeof relayHatchDefinition;
