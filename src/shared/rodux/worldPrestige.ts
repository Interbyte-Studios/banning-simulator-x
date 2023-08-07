import Rodux from "@rbxts/rodux";
import { WORLD_PRESTIGE } from "shared/configs/worldPrestige";
import { WorldName, Worlds } from "shared/configs/worlds";

export type WorldPrestigeState = {
	[WORLD in keyof Worlds]: {
		currencyUpgrades: number;
		additionalPetsUpgrades: number;
		reducedVoidEggCostUpgrades: number;
		reducedFusionCostUpgrades: number;
		currentPrestige: number;
		prestigeTokens: number;
	};
};
export type WorldPrestigeActions =
	| PurchaseWorldPrestigeCurrencyUpgrade
	| PurchaseWorldPrestigePetsUpgrade
	| PurchaseWorldPrestigeVoidEggUpgrade
	| PurchaseWorldPrestigeFusionUpgrade
	| ClaimPrestige
	| RemovePrestigeToken;

interface PurchaseWorldPrestigeCurrencyUpgrade extends Rodux.Action<"purchaseWorldPrestigeCurrencyUpgrade"> {
	worldName: WorldName;
}

interface PurchaseWorldPrestigePetsUpgrade extends Rodux.Action<"purchaseWorldPrestigePetsUpgrade"> {
	worldName: WorldName;
}

interface PurchaseWorldPrestigeVoidEggUpgrade extends Rodux.Action<"purchaseWorldPrestigeVoidEggUpgrade"> {
	worldName: WorldName;
}

interface PurchaseWorldPrestigeFusionUpgrade extends Rodux.Action<"purchaseWorldPrestigeFusionUpgrade"> {
	worldName: WorldName;
}

interface ClaimPrestige extends Rodux.Action<"claimPrestige"> {
	worldName: WorldName;
	currentPrestige: number;
}

interface RemovePrestigeToken extends Rodux.Action<"removePrestigeToken"> {
	worldName: WorldName;
	amount: number;
}

/**
 * @param worldName The name of the world the upgrade was purchased for.
 * @returns The Rodux action to dispatch.
 */
export function purchaseWorldPrestigeCurrencyUpgrade(
	worldName: WorldName,
): PurchaseWorldPrestigeCurrencyUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseWorldPrestigeCurrencyUpgrade",
		worldName,
	};
}

/**
 * @param worldName The name of the world the upgrade was purchased for.
 * @returns The Rodux action to dispatch.
 */
export function purchaseWorldPrestigePetsUpgrade(
	worldName: WorldName,
): PurchaseWorldPrestigePetsUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseWorldPrestigePetsUpgrade",
		worldName,
	};
}

/**
 * @param worldName The name of the world the upgrade was purchased for.
 * @returns The Rodux action to dispatch.
 */
export function purchaseWorldPrestigeVoidEggUpgrade(
	worldName: WorldName,
): PurchaseWorldPrestigeVoidEggUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseWorldPrestigeVoidEggUpgrade",
		worldName,
	};
}

/**
 * @param worldName The name of the world the upgrade was purchased for.
 * @returns The Rodux action to dispatch.
 */
export function purchaseWorldPrestigeFusionUpgrade(
	worldName: WorldName,
): PurchaseWorldPrestigeFusionUpgrade & Rodux.AnyAction {
	return {
		type: "purchaseWorldPrestigeFusionUpgrade",
		worldName,
	};
}

/**
 * @param worldName The name of the world the upgrade was purchased for.
 * @param amount The amount of prestige tokens to remove.
 * @returns The Rodux action to dispatch.
 */
export function removePrestigeToken(worldName: WorldName, amount: number): RemovePrestigeToken & Rodux.AnyAction {
	return {
		type: "removePrestigeToken",
		worldName,
		amount,
	};
}

/**
 * @param worldName The name of the world the upgrade was purchased for.
 * @param currentPrestige The prestige the player is on before the new prestige is claimed.
 * @returns The Rodux action to dispatch.
 */
export function claimPrestige(worldName: WorldName, currentPrestige: number): ClaimPrestige & Rodux.AnyAction {
	return {
		type: "claimPrestige",
		worldName,
		currentPrestige,
	};
}

export const defaultWorldPrestigeState: WorldPrestigeState = {
	"Ban Land": {
		currencyUpgrades: 0,
		additionalPetsUpgrades: 0,
		reducedVoidEggCostUpgrades: 0,
		reducedFusionCostUpgrades: 0,
		currentPrestige: 0,
		prestigeTokens: 0,
	},
	"Cyber Cities": {
		currencyUpgrades: 0,
		additionalPetsUpgrades: 0,
		reducedVoidEggCostUpgrades: 0,
		reducedFusionCostUpgrades: 0,
		currentPrestige: 0,
		prestigeTokens: 0,
	},
};

/* eslint-disable jsdoc/require-jsdoc */
export const worldPrestigeReducer = Rodux.createReducer<WorldPrestigeState, WorldPrestigeActions>(
	defaultWorldPrestigeState,
	{
		purchaseWorldPrestigeCurrencyUpgrade: (state, action) => {
			if (state[action.worldName].currencyUpgrades >= WORLD_PRESTIGE.currency.maxUpgrades) {
				return state;
			}

			return {
				...state,
				[action.worldName]: {
					...state[action.worldName],
					currencyUpgrades: state[action.worldName].currencyUpgrades + 1,
					prestigeTokens: state[action.worldName].prestigeTokens - 1,
				},
			};
		},
		purchaseWorldPrestigeFusionUpgrade: (state, action) => {
			if (state[action.worldName].reducedFusionCostUpgrades >= WORLD_PRESTIGE.reducedFusionCost.maxUpgrades) {
				return state;
			}

			return {
				...state,
				[action.worldName]: {
					...state[action.worldName],
					reducedFusionCostUpgrades: state[action.worldName].reducedFusionCostUpgrades + 1,
					prestigeTokens: state[action.worldName].prestigeTokens - 1,
				},
			};
		},
		purchaseWorldPrestigePetsUpgrade: (state, action) => {
			if (state[action.worldName].additionalPetsUpgrades >= WORLD_PRESTIGE.additionalPets.maxUpgrades) {
				return state;
			}

			return {
				...state,
				[action.worldName]: {
					...state[action.worldName],
					additionalPetsUpgrades: state[action.worldName].additionalPetsUpgrades + 1,
					prestigeTokens: state[action.worldName].prestigeTokens - 1,
				},
			};
		},
		purchaseWorldPrestigeVoidEggUpgrade: (state, action) => {
			if (state[action.worldName].reducedVoidEggCostUpgrades >= WORLD_PRESTIGE.reducedVoidEggCost.maxUpgrades) {
				return state;
			}

			return {
				...state,
				[action.worldName]: {
					...state[action.worldName],
					reducedVoidEggCostUpgrades: state[action.worldName].reducedVoidEggCostUpgrades + 1,
					prestigeTokens: state[action.worldName].prestigeTokens - 1,
				},
			};
		},
		claimPrestige: (state, action) => {
			const newPrestige = action.currentPrestige + 1;
			switch (newPrestige) {
				case 10:
				case 20:
				case 30:
				case 40:
				case 50: {
					return {
						...state,
						[action.worldName]: {
							...state[action.worldName],
							currentPrestige: action.currentPrestige + 1,
						},
					};
				}
			}

			return {
				...state,
				[action.worldName]: {
					...state[action.worldName],
					currentPrestige: action.currentPrestige + 1,
					prestigeTokens: state[action.worldName].prestigeTokens + 1,
				},
			};
		},
		removePrestigeToken: (state, action) => {
			return {
				...state,
				[action.worldName]: {
					...state[action.worldName],
					prestigeTokens: state[action.worldName].prestigeTokens - action.amount,
				},
			};
		},
	},
);
/* eslint-enable jsdoc/require-jsdoc */
