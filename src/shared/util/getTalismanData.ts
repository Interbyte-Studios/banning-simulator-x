import { Talisman, TALISMANS } from "shared/configs/talismans";

interface TalismanData extends Talisman {
	name: string;
}

/**
 * Fetches the metadata of the talisman.
 *
 * @param id The id of the talisman.
 * @returns The data of the talisman.
 */
export function getTalismanData(id: number): TalismanData {
	for (const [talismanName, talismanData] of pairs(TALISMANS)) {
		if (talismanData.id === id) {
			const _talismanData = { ...talismanData, name: talismanName };
			return _talismanData;
		}
	}
	throw `Expected to find data for talisman of id ${id}`;
}
