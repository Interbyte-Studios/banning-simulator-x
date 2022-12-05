import Rodux from "@rbxts/rodux";
import { ValidTitle } from "shared/configs/titles";

export type PetTeamsState = Array<{
    id: number;
}>;
export type TitleActions = EquipTitle;

interface EquipTitle extends Rodux.Action<"equipTitle"> {
	title: ValidTitle;
}

/**
 * Equips a title for a player.
 *
 * @param titleName The name of the title to equip.
 * @returns The rodux action to dispatch.
 */
export function equipTitle(titleName: ValidTitle): EquipTitle & Rodux.AnyAction {
	return {
		type: "equipTitle",
		title: titleName,
	};
}

/* eslint-disable jsdoc/require-jsdoc */
export const titleReducer = Rodux.createReducer<TitleState, TitleActions>(undefined, {
	equipTitle: (_, action) => action.title,
});
/* eslint-enable jsdoc/require-jsdoc */
