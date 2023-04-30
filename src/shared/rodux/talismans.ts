import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { TALISMAN_PHASES, TalismanPhases } from "shared/configs/talismans";

import { KillNpc } from "./currencies";

export type Talisman = { id: number; bans: number; phase: TalismanPhases };
export type TalismansState = Array<Talisman>;
export type TalismanActions = PurchaseTalisman | Admin_ModifyTalismanLevel;

export interface PurchaseTalisman extends Rodux.Action<"purchaseTalisman"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

export interface Admin_ModifyTalismanLevel extends Rodux.Action<"admin_modifyTalismanLevel"> {
	talismanId: number;
	phase: TalismanPhases;
}

export const defaultTalismans: TalismansState = [];

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

/**
 * Modifies the level of a talisman.
 *
 * @param talismanId The id of the talisman to modify.
 * @param phase The phase to set the talisman to.
 * @returns The Rodux action to dispatch.
 */
export function admin_modifyTalismanLevel(
	talismanId: number,
	phase: TalismanPhases,
): Admin_ModifyTalismanLevel & Rodux.AnyAction {
	return {
		type: "admin_modifyTalismanLevel",
		talismanId,
		phase,
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
	admin_modifyTalismanLevel: (state, action) => {
		const newState = [...state];

		const currentTalismanIndex = newState.findIndex((talisman) => talisman.id === action.talismanId);
		if (currentTalismanIndex === undefined) {
			throw `Expected player to own the talisman ${action.talismanId}`;
		}

		const newTalismanData = { ...newState[currentTalismanIndex] };
		const phaseBanPreset = TALISMAN_PHASES.find((talismanPhase) => talismanPhase.phase === action.phase);
		if (phaseBanPreset !== undefined) {
			newTalismanData.phase = action.phase;
			newTalismanData.bans = phaseBanPreset.requiredBans;
		}

		newState[currentTalismanIndex] = newTalismanData;
		return newState;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
