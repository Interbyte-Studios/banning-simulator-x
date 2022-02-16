import { t } from "@rbxts/t";

export const isCurrency = t.literal("gold");
export type Currency = t.static<typeof isCurrency>;
