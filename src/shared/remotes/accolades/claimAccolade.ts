import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export enum ClaimAccoladeFailKind {
	AlreadyRedeemed,
	NotEnoughProgress,
}

export const claimAccoladeDefinition = Net.Definitions.ServerAsyncFunction<
	(id: number) => { success: false; reason: ClaimAccoladeFailKind } | { success: true }
>([createTypeChecker(t.number)]);
export type ClaimAccoladeDefinition = typeof claimAccoladeDefinition;
