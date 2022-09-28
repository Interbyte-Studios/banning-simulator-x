import Net from "@rbxts/net";
import { t } from "@rbxts/t";

export const isNpcCharacter = t.intersection(
	t.instanceIsA("Model"),
	t.children({
		Humanoid: t.instanceIsA("Humanoid"),
		Head: t.instanceIsA("BasePart"),
	}),
);
export type NpcCharacter = t.static<typeof isNpcCharacter>;

export const damageNPCDefinition = Net.Definitions.ClientToServerEvent<[npcCharacter: NpcCharacter]>([]);
export type DamageNPCDefinition = typeof damageNPCDefinition;
