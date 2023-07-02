import Rodux from "@rbxts/rodux";

export type MigratedBansActions = MigrateBans;
export type MigratedBansState = boolean;
export const defaultMigratedBans: MigratedBansState = false;

interface MigrateBans extends Rodux.Action<"migrateBans"> {}

/**
 * @returns The Rodux action to dispatch.
 */
export function migrateBans(): MigrateBans & Rodux.AnyAction {
	return {
		type: "migrateBans",
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const migratedBansReducer = Rodux.createReducer<MigratedBansState, MigratedBansActions>(defaultMigratedBans, {
	migrateBans: () => {
		return true;
	},
});
/* eslint-enable jsdoc/require-jsdoc */
