import { t } from "@rbxts/t";

import { EggName } from "./eggs";
import { BoostProduct, isCurrencyPurchaseOption, LIMITED_EGG } from "./game";

export const isWheelSpinPetReward = t.interface({
	petId: t.number,
});
export type WheelSpinPetReward = t.static<typeof isWheelSpinPetReward>;

export const isWheelSpinCurrencyReward = t.interface({
	name: t.literal("coins", "gems"),
	tier: isCurrencyPurchaseOption,
});
export type WheelSpinCurrencyRewar = t.static<typeof isWheelSpinCurrencyReward>;

export type WheelSpinData = Array<{
	id: number;
	chance: number;
	reward: EggName | WheelSpinPetReward | WheelSpinCurrencyRewar | BoostProduct;
}>;
export const WHEEL_SPIN: WheelSpinData = [
	{
		id: 8,
		chance: 0.5,
		reward: {
			petId: 10013,
		},
	},
	{
		id: 7,
		chance: 1.5,
		reward: LIMITED_EGG,
	},
	{
		id: 6,
		chance: 8,
		reward: {
			name: "gems",
			tier: "vault",
		},
	},
	{
		id: 5,
		chance: 10,
		reward: {
			name: "coins",
			tier: "vault",
		},
	},
	{
		id: 4,
		chance: 15,
		reward: "x2 Hatching Luck",
	},
	{
		id: 3,
		chance: 20,
		reward: "x2 Currency",
	},
	{
		id: 2,
		chance: 20,
		reward: "x2 Pet Experience",
	},
	{
		id: 1,
		chance: 25,
		reward: "x2 Rank Experience",
	},
];
