import { t } from "@rbxts/t";

export const currencies = ["gold"] as const;

export const isCurrency = t.literal(...currencies);
export type Currency = t.static<typeof isCurrency>;
