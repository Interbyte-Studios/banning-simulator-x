import { t } from "@rbxts/t";

export const isNpcCharacter = t.intersection(
	t.instanceIsA("Model"),
	t.children({
		Humanoid: t.instanceIsA("Humanoid"),
		Head: t.instanceIsA("BasePart"),
	}),
);
export type NpcCharacter = t.static<typeof isNpcCharacter>;
