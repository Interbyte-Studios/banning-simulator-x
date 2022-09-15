import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export enum RedeemCodeFailKind {
	InvalidCode,
	AlreadyRedeemed,
}

export const redeemCodeDefinition = Net.Definitions.ServerAsyncFunction<
	(code: string) => { success: false; reason: RedeemCodeFailKind } | { success: true }
>([createTypeChecker(t.string)]);
export type RedeemCodeDefinition = typeof redeemCodeDefinition;
