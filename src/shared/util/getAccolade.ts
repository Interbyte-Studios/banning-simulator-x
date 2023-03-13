import { Accolade, ACCOLADES } from "shared/configs/accolades";

/**
 * Returns the metadata of the requested accolade.
 *
 * @param id The id of the accolade.
 * @returns The accolade metadata.
 */
export const getAccolade = (id: number): Accolade => {
	const requestedAccolade = ACCOLADES.find((accolade) => accolade.id === id);
	assert(requestedAccolade, `Failed to get accolade of id: ${id}`);

	return requestedAccolade;
};
