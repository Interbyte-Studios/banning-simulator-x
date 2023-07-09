import Net from "@rbxts/net";
import { createTypeChecker } from "@rbxts/net/out/middleware";
import { t } from "@rbxts/t";

export const isNpcCharacter = t.intersection(
	t.instanceIsA("Model"),
	t.children({
		Humanoid: t.instanceIsA("Humanoid"),
		Head: t.instanceIsA("BasePart"),
	}),
);
export type NpcCharacter = t.static<typeof isNpcCharacter>;

export const damageNPCDefinition = Net.Definitions.ClientToServerEvent<[npcCharacter: NpcCharacter]>([
	createTypeChecker(isNpcCharacter),
]);
export type DamageNPCDefinition = typeof damageNPCDefinition;
