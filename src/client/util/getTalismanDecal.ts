import assetIds from "shared/assets";
import { TalismanPhases } from "shared/configs/talismans";
import { getTalismanData } from "shared/util/getTalismanData";

/**
 * Fetches the decal of a given talisman.
 *
 * @param talismanId The id of the talisman.
 * @param phase The phase of the talisman.
 * @returns The decal of the weapon.
 */
export function getTalismanDecal(talismanId: number, phase: TalismanPhases): string {
	const talismanData = getTalismanData(talismanId);

	const capitalizedPhaseName = phase === "artifact" ? "Artifact" : phase === "awakend" ? "Awakend" : "Normal";
	const realTalismanName =
		phase === "normal"
			? (talismanData.name as keyof typeof assetIds.images.decals.talismans)
			: (`${capitalizedPhaseName} ${talismanData.name}` as keyof typeof assetIds.images.decals.talismans);

	const image = assetIds.images.decals.talismans[realTalismanName];
	assert(image, `Failed to get decal for talisman of id: "${talismanId}" of phase: "${phase}"`);

	return image;
}
