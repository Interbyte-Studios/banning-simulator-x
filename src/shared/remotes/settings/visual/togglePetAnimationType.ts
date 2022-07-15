import Net from "@rbxts/net";
import { ValidPetAnimationType } from "shared/rodux/settings";

export const togglePetAnimationTypeDefinition =
	Net.Definitions.ClientToServerEvent<[animationType: ValidPetAnimationType]>();
export type TogglePetAnimationTypeDefinition = typeof togglePetAnimationTypeDefinition;
