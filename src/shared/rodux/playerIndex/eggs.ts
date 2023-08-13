import Rodux from "@rbxts/rodux";
import { EggName } from "shared/configs/eggs";
import { getEggNameFromPetId } from "shared/util/getEggFromPetId";

import { HatchEgg } from "../eggs";

export type EggIndexState = Map<
	EggName,
	{
		regular: number;
		void: number;
	}
>;

export const defaultEggIndexState: EggIndexState = new Map();

/* eslint-disable jsdoc/require-jsdoc */
export const eggIndexReducer = Rodux.createReducer<EggIndexState, HatchEgg>(defaultEggIndexState, {
	hatchEgg: (state, action) => {
		const newState = new Map([...state]);

		for (const { id, variant } of action.pets) {
			if (variant === "radiant") {
				continue;
			}

			const eggName = getEggNameFromPetId(id);
			const egg = newState.get(eggName) ?? { regular: 0, void: 0, radiant: 0 };

			egg[variant]++;
			newState.set(eggName, egg);
		}

		return newState;
	},
});
