import { TITLES, ValidTitle } from "shared/configs/titles";
import { Store } from "shared/rodux";
import { equipTitle as dispatchEquipTitle } from "shared/rodux/title";

/**
 * Equips a title for a player.
 *
 * ### Errors
 * Errors if the title did not exist in the config.
 *
 * @param store The store to equip the title for.
 * @param title The name of the title to equip.
 */
export function equipTitle(store: Store, title: ValidTitle): void {
	// check that player has the pre-requisites for the title
	const titleConfig = TITLES.find((x) => x.name === title);
	assert(titleConfig, `Failed to get title ${title} from config`);

	if (!titleConfig.condition(store.getState())) {
		return;
	}

	// equip title
	store.dispatch(dispatchEquipTitle(title));
}
