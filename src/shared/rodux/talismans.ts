import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { TALISMAN_PHASES, TalismanPhases, TALISMANS } from "shared/configs/talismans";

import { KillNpc } from "./currencies";

export type Talisman = { id: number; bans: number; phase: TalismanPhases };
export type TalismansState = Array<Talisman>;
export type TalismanActions = PurchaseTalisman;

export interface PurchaseTalisman extends Rodux.Action<"purchaseTalisman"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

const defaultTalismans: TalismansState = [];
/*
for (const [, data] of pairs(TALISMANS)) {
	defaultTalismans.push({
		id: data.id,
		bans: 0,
		phase: "artifact",
	});
}
*/

/**
 * Purchases a talisman from the stor, saving it to players talisman inventory.
 *
 * @param data The data associated with the talisman purchase.
 * @returns The Rodux action to dispatch.
 */
export function purchaseTalisman(data: Omit<PurchaseTalisman, "type">): PurchaseTalisman & Rodux.AnyAction {
	return {
		type: "purchaseTalisman",
		id: data.id,
		cost: data.cost,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const talismanReducer = Rodux.createReducer<TalismansState, TalismanActions | KillNpc>(defaultTalismans, {
	purchaseTalisman: (state, action) => {
		return [
			...state,
			{
				id: action.id,
				bans: 0,
				phase: "normal",
			},
		];
	},
	killNpc: (state, action) => {
		if (action.talismanId === undefined) {
			return state;
		}

		const newState = [...state];

		const currentTalismanIndex = newState.findIndex((talisman) => talisman.id === action.talismanId);
		if (currentTalismanIndex === undefined) {
			throw `Expected player to own the talisman ${action.talismanId}`;
		}

		const currentTalisman = newState[currentTalismanIndex];

		const increaseTalismanBanCounter = currentTalisman.bans + 1;

		let phase: TalismanPhases | undefined;
		for (const talismanPhase of TALISMAN_PHASES) {
			if (currentTalisman.bans >= talismanPhase.requiredBans) {
				phase = talismanPhase.phase;
			}
		}
		assert(phase, `Expected to find a phase for the currently equipped talisman with id: ${action.talismanId}`);

		let upgradePhase = false;
		if (phase !== currentTalisman.phase) {
			upgradePhase = true;
		}

		const newTalismanData = { ...newState[currentTalismanIndex] };
		newTalismanData.bans = increaseTalismanBanCounter;
		newTalismanData.phase = upgradePhase ? phase : currentTalisman.phase;

		newState[currentTalismanIndex] = newTalismanData;
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
