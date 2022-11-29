import Rodux from "@rbxts/rodux";
import { Currency } from "shared/configs/currencies";
import { TALISMAN_PHASES, TalismanPhases } from "shared/configs/talismans";

import { KillNpc } from "./currencies";

export type TalismansState = Map<number, { bans: number; phase: TalismanPhases }>;

export type TalismanActions = PurchaseTalisman;

export interface PurchaseTalisman extends Rodux.Action<"purchaseTalisman"> {
	cost: {
		currency: Currency;
		amount: number;
	};
	id: number;
}

const defaultTalismans: TalismansState = new Map();

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
		return new Map([...state, [action.id, { bans: 0, phase: "normal" }]]);
	},
	killNpc: (state, action) => {
		if (action.talismanId === undefined) {
			return state;
		}

		const currentTalisman = state.get(action.talismanId);
		if (currentTalisman === undefined) {
			throw `Expected player to own the talisman ${action.talismanId}`;
		}

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

		return new Map([
			...state,
			[action.talismanId, { bans: increaseTalismanBanCounter, phase: upgradePhase ? phase : currentTalisman.phase }],
		]);
	},
});
/* eslint-enable jsdoc/require-jsdoc */
