import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { isValidPetAnimationType, ValidPetAnimationType } from "shared/rodux/settings";

export const togglePetAnimationTypeDefinition = Net.Definitions.ClientToServerEvent<
	[animationType: ValidPetAnimationType]
>([createTypeChecker(isValidPetAnimationType)]);
export type TogglePetAnimationTypeDefinition = typeof togglePetAnimationTypeDefinition;
