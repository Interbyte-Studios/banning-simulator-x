import { t } from "@rbxts/t";

export const RARITIES = t.literal("Basic", "Ordinary", "Rare", "Legendary", "Primordial", "Prismatic");
export type Rarities = t.static<typeof RARITIES>;
