import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export enum VerifyDiscordFailKind {
	NotInDiscord,
	InternalError,
	RateLimit,
}

export const verifyDiscordDefinition = Net.Definitions.ServerAsyncFunction<
	(tag: string) => { success: false; reason: VerifyDiscordFailKind } | { success: true }
>([createTypeChecker(t.string)]);
export type VerifyDiscordDefinition = typeof verifyDiscordDefinition;
