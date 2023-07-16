import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";
import { Gamepasses, isGamepass } from "shared/configs/game";

export const useGamepassGiftDefinition = Net.Definitions.ClientToServerEvent<
	[gamepassName: Gamepasses, targetPlayer: Player]
>([createTypeChecker(isGamepass, t.instanceIsA("Player"))]);
export type UseGamepassGiftDefinition = typeof useGamepassGiftDefinition;

export const gamepassGiftReceivedDefinition =
	Net.Definitions.ServerToClientEvent<[gamepassName: Gamepasses, playerWhoGifted: Player]>();
export type GamepassGiftReceivedDefinition = typeof gamepassGiftReceivedDefinition;
