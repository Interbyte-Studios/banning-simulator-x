import Rodux from "@rbxts/rodux";
import { t } from "@rbxts/t";
import { EggName } from "shared/configs/eggs";

import { AddPet } from "./pets";

export const isValidIndexHatch = t.literal("regular", "void");
export const isValidIndexFusion = t.literal("void", "radiant");

export interface PlayerIndexState {
	pets: Map<
		number,
		{
			hatched: {
				regular: number;
				void: number;
			};
			fused: {
				void: number;
				radiant: number;
			};
			maxLevel: {
				regular: number;
				void: number;
				radiant: number;
			};
		}
	>;
	eggs: Map<EggName, { regular: number; void: number }>;
}

const defaultPlayerIndex: PlayerIndexState = {
	pets: new Map(),
	eggs: new Map(),
};

/* eslint-disable jsdoc/require-jsdoc */
export const playerIndexReducer = Rodux.createReducer<PlayerIndexState, AddPet>(defaultPlayerIndex, {
	addPet: (state, action) => {
		const newState = { ...state };

		for (const petToIndex of action.pets) {
			let pet = newState.pets.get(petToIndex.id);
			if (pet === undefined) {
				newState.pets.set(petToIndex.id, {
					hatched: {
						regular: 0,
						void: 0,
					},
					fused: {
						void: 0,
						radiant: 0,
					},
					maxLevel: {
						regular: 0,
						void: 0,
						radiant: 0,
					},
				});

				pet = newState.pets.get(petToIndex.id);
				assert(pet, `Failed to set index data for pet with id "${petToIndex.id}".`);
			}

			let egg = newState.eggs.get(petToIndex.egg);
			if (egg === undefined) {
				newState.eggs.set(petToIndex.egg, { regular: 0, void: 0 });

				egg = newState.eggs.get(petToIndex.egg);
				assert(egg, `Failed to set index data for egg "${petToIndex.egg}".`);
			}

			switch (petToIndex.method) {
				case "hatch": {
					assert(
						isValidIndexHatch(petToIndex.variant),
						`Attempted to index a pet hatch of unsupported variant "${petToIndex.variant}".`,
					);

					pet.hatched[petToIndex.variant] += 1;
					break;
				}
				case "fuse": {
					assert(
						isValidIndexFusion(petToIndex.variant),
						`Attempted to index a pet fusion of unsupported variant "${petToIndex.variant}".`,
					);

					pet.fused[petToIndex.variant] += 1;
					break;
				}
				case "maxLevel": {
					warn(`Attempting to add pet with method "maxLevel"? This is unallowed.`);
					continue;
				}
			}
		}

		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
